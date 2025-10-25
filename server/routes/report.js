import express from 'express';
import { ReportService } from '../services/report.js';
import { ChatService } from '../services/chat.js';
import { query } from '../db/index.js';

const router = express.Router();
const reportService = new ReportService();
const chatService = new ChatService();

// Submit a report
router.post('/', async (req, res) => {
  try {
    const { sessionId, reason } = req.body;
    const reporterIp = req.headers['x-forwarded-for'] || req.ip;
    
    if (!sessionId || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get session details to find reported user's IP
    const sessionResult = await query(
      `SELECT * FROM sessions WHERE id = $1`,
      [sessionId]
    );
    
    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const session = sessionResult.rows[0];
    
    // Determine which IP to report (the one that's not the reporter)
    const reportedIp = session.user1_ip === reporterIp 
      ? session.user2_ip 
      : session.user1_ip;
    
    // Get chat logs from this session
    const chatLogs = await chatService.getSessionMessages(sessionId);
    
    // Create report
    const reportId = await reportService.createReport(
      reporterIp,
      reportedIp,
      sessionId,
      reason,
      chatLogs
    );
    
    res.json({ 
      success: true, 
      reportId,
      message: 'Report submitted successfully'
    });
    
  } catch (error) {
    console.error('Report submission error:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

export default router;
