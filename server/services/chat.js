import { query } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

// Chat service - manages sessions and messages
export class ChatService {
  
  async createSession(user1Ip, user2Ip, user1Name, user2Name) {
    const sessionId = uuidv4();
    
    await query(
      `INSERT INTO sessions (id, user1_ip, user2_ip, user1_name, user2_name, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [sessionId, user1Ip, user2Ip, user1Name, user2Name]
    );
    
    console.log(`Created session: ${sessionId}`);
    return sessionId;
  }
  
  async endSession(sessionId) {
    if (!sessionId) return;
    
    await query(
      `UPDATE sessions SET ended_at = NOW() WHERE id = $1`,
      [sessionId]
    );
    
    console.log(`Ended session: ${sessionId}`);
  }
  
  async saveMessage(sessionId, senderIp, messageText) {
    const messageId = uuidv4();
    
    await query(
      `INSERT INTO messages (id, session_id, sender_ip, message, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [messageId, sessionId, senderIp, messageText]
    );
    
    return messageId;
  }
  
  async getSessionMessages(sessionId) {
    const result = await query(
      `SELECT * FROM messages 
       WHERE session_id = $1 
       ORDER BY created_at ASC`,
      [sessionId]
    );
    
    return result.rows;
  }
}
