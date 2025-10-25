import { query } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';
import geoip from 'geoip-lite';

// Report service - handles user reports
export class ReportService {
  
  async createReport(reporterIp, reportedIp, sessionId, reason, chatLogs) {
    const reportId = uuidv4();
    
    // Get location from IP
    let location = geoip.lookup(reportedIp);
    
    // If no location found (localhost or VPN), create fallback
    if (!location) {
      location = {
        ip: reportedIp,
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
        note: reportedIp.includes('::1') || reportedIp.includes('127.0.0.1') 
          ? 'Localhost - development environment' 
          : 'Location not available (VPN/Proxy possible)'
      };
    } else {
      location.ip = reportedIp;
    }
    
    await query(
      `INSERT INTO reports (id, reporter_ip, reported_ip, session_id, reason, chat_logs, location, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [reportId, reporterIp, reportedIp, sessionId, reason, JSON.stringify(chatLogs), JSON.stringify(location)]
    );
    
    console.log(`Report created: ${reportId} - ${reason}`);
    
    // Check if this IP has multiple reports (auto-ban threshold)
    const reportCount = await this.getReportCount(reportedIp);
    
    if (reportCount >= 3) {
      // Auto-ban after 3 reports
      const banService = new (await import('./ban.js')).BanService();
      await banService.banIp(reportedIp, 'Multiple reports', 24); // 24 hour ban
      console.log(`Auto-banned IP: ${reportedIp} (${reportCount} reports)`);
    }
    
    return reportId;
  }
  
  async getReportCount(ip) {
    const result = await query(
      `SELECT COUNT(*) as count FROM reports 
       WHERE reported_ip = $1 
       AND created_at > NOW() - INTERVAL '7 days'`,
      [ip]
    );
    
    return parseInt(result.rows[0]?.count || 0);
  }
  
  async getReportsByIp(ip, limit = 10) {
    const result = await query(
      `SELECT * FROM reports 
       WHERE reported_ip = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [ip, limit]
    );
    
    return result.rows;
  }
}
