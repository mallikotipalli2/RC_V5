import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { MatchmakingService } from './services/matchmaking.js';
import { ChatService } from './services/chat.js';
import { ReportService } from './services/report.js';
import { BanService } from './services/ban.js';
import reportRoutes from './routes/report.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Services
const matchmaking = new MatchmakingService();
const chatService = new ChatService();
const reportService = new ReportService();
const banService = new BanService();

// REST Routes
app.use('/api/report', reportRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io Connection Handler
io.on('connection', (socket) => {
  const clientIp = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
  const userName = socket.handshake.query.userName || 'RandomChip';
  
  console.log(`User connected: ${socket.id} (${userName}) from ${clientIp}`);
  
  // Store user info immediately
  socket.data = {
    ip: clientIp,
    userName: userName,
    partnerId: null,
    sessionId: null
  };
  
  console.log(`✅ Socket ${socket.id} ready, waiting for 'search' event...`);
  
  // Handle user searching for a chat partner
  socket.on('search', async () => {
    console.log(`🔍 ${socket.id} searching for partner...`);
    
    // Check if IP is banned
    const isBanned = await banService.isIpBanned(clientIp);
    if (isBanned) {
      socket.emit('banned', { message: 'You are temporarily banned from using this service.' });
      socket.disconnect();
      return;
    }
    
    socket.emit('searching');
    
    // Try to match with someone
    const partner = matchmaking.findMatch(socket);
    
    if (partner) {
      // Create chat session
      const sessionId = await chatService.createSession(
        socket.data.ip,
        partner.data.ip,
        socket.data.userName,
        partner.data.userName
      );
      
      // Link the partners
      socket.data.partnerId = partner.id;
      socket.data.sessionId = sessionId;
      partner.data.partnerId = socket.id;
      partner.data.sessionId = sessionId;
      
      // Notify both users
      socket.emit('connected', { partnerName: partner.data.userName, sessionId });
      partner.emit('connected', { partnerName: socket.data.userName, sessionId });
      
      console.log(`Matched: ${socket.id} <-> ${partner.id}`);
    } else {
      // Add to waiting queue
      matchmaking.addToQueue(socket);
    }
  });
  
  // Handle chat messages
  socket.on('message', async (data) => {
    const { message } = data;
    const partnerId = socket.data.partnerId;
    
    if (!partnerId) {
      socket.emit('error', { message: 'No active chat session' });
      return;
    }
    
    // Store message in database
    await chatService.saveMessage(
      socket.data.sessionId,
      socket.data.ip,
      message
    );
    
    // Send to partner
    const partnerSocket = io.sockets.sockets.get(partnerId);
    if (partnerSocket) {
      partnerSocket.emit('message', {
        message: message,
        timestamp: new Date()
      });
    }
  });
  
  // Handle typing indicator
  socket.on('typing', () => {
    const partnerId = socket.data.partnerId;
    if (partnerId) {
      const partnerSocket = io.sockets.sockets.get(partnerId);
      if (partnerSocket) {
        partnerSocket.emit('partner_typing');
      }
    }
  });
  
  // Handle stop typing
  socket.on('stop_typing', () => {
    const partnerId = socket.data.partnerId;
    if (partnerId) {
      const partnerSocket = io.sockets.sockets.get(partnerId);
      if (partnerSocket) {
        partnerSocket.emit('partner_stopped_typing');
      }
    }
  });
  
  // Handle next partner request
  socket.on('next', async () => {
    const partnerId = socket.data.partnerId;
    
    if (partnerId) {
      // End current session
      await chatService.endSession(socket.data.sessionId);
      
      // Notify partner
      const partnerSocket = io.sockets.sockets.get(partnerId);
      if (partnerSocket) {
        partnerSocket.emit('partner_disconnected');
        partnerSocket.data.partnerId = null;
        partnerSocket.data.sessionId = null;
      }
      
      // Reset current user
      socket.data.partnerId = null;
      socket.data.sessionId = null;
    }
    
    // Start new search
    socket.emit('searching');
    const partner = matchmaking.findMatch(socket);
    
    if (partner) {
      const sessionId = await chatService.createSession(
        socket.data.ip,
        partner.data.ip,
        socket.data.userName,
        partner.data.userName
      );
      
      socket.data.partnerId = partner.id;
      socket.data.sessionId = sessionId;
      partner.data.partnerId = socket.id;
      partner.data.sessionId = sessionId;
      
      socket.emit('connected', { partnerName: partner.data.userName });
      partner.emit('connected', { partnerName: socket.data.userName });
    } else {
      matchmaking.addToQueue(socket);
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Remove from queue if waiting
    matchmaking.removeFromQueue(socket.id);
    
    // Notify partner if in chat
    const partnerId = socket.data.partnerId;
    if (partnerId) {
      const partnerSocket = io.sockets.sockets.get(partnerId);
      if (partnerSocket) {
        partnerSocket.emit('partner_disconnected');
        partnerSocket.data.partnerId = null;
        partnerSocket.data.sessionId = null;
      }
      
      // End session
      if (socket.data.sessionId) {
        await chatService.endSession(socket.data.sessionId);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

httpServer.listen(PORT, HOST, () => {
  console.log(`🚀 RandomChips Server running on ${HOST}:${PORT}`);
  console.log(`📡 Socket.io ready for connections`);
});
