import { query } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

// Ban service - manages IP bans
export class BanService {
  
  async banIp(ip, reason, durationHours = 24) {
    const banId = uuidv4();
    const bannedUntil = new Date(Date.now() + durationHours * 60 * 60 * 1000);
    
    // Check if already banned
    const existing = await query(
      `SELECT * FROM bans 
       WHERE ip_address = $1 
       AND banned_until > NOW()`,
      [ip]
    );
    
    if (existing.rows.length > 0) {
      // Extend ban
      await query(
        `UPDATE bans 
         SET banned_until = $1, reason = $2 
         WHERE ip_address = $3`,
        [bannedUntil, reason, ip]
      );
      console.log(`Extended ban for IP: ${ip}`);
    } else {
      // Create new ban
      await query(
        `INSERT INTO bans (id, ip_address, reason, banned_until, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [banId, ip, reason, bannedUntil]
      );
      console.log(`Banned IP: ${ip} until ${bannedUntil}`);
    }
    
    return banId;
  }
  
  async isIpBanned(ip) {
    const result = await query(
      `SELECT * FROM bans 
       WHERE ip_address = $1 
       AND banned_until > NOW()`,
      [ip]
    );
    
    return result.rows.length > 0;
  }
  
  async unbanIp(ip) {
    await query(
      `DELETE FROM bans WHERE ip_address = $1`,
      [ip]
    );
    console.log(`Unbanned IP: ${ip}`);
  }
  
  async cleanupExpiredBans() {
    const result = await query(
      `DELETE FROM bans WHERE banned_until < NOW()`
    );
    console.log(`Cleaned up ${result.rowCount} expired bans`);
  }
}
