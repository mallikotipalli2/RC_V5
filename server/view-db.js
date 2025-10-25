import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function viewDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to Railway PostgreSQL\n');

    // View Sessions
    console.log('📊 SESSIONS:');
    console.log('─'.repeat(80));
    const sessions = await client.query('SELECT * FROM sessions ORDER BY created_at DESC LIMIT 10');
    if (sessions.rows.length === 0) {
      console.log('No sessions found');
    } else {
      sessions.rows.forEach(s => {
        console.log(`ID: ${s.id}`);
        console.log(`Users: ${s.user1_name || 'Anonymous'} (${s.user1_ip}) <-> ${s.user2_name || 'Anonymous'} (${s.user2_ip})`);
        console.log(`Created: ${s.created_at}, Ended: ${s.ended_at || 'Active'}`);
        console.log('─'.repeat(80));
      });
    }

    // View Messages
    console.log('\n💬 MESSAGES:');
    console.log('─'.repeat(80));
    const messages = await client.query('SELECT * FROM messages ORDER BY created_at DESC LIMIT 20');
    if (messages.rows.length === 0) {
      console.log('No messages found');
    } else {
      messages.rows.forEach(m => {
        console.log(`[${new Date(m.created_at).toLocaleString()}] ${m.sender_ip}: ${m.message}`);
      });
    }

    // View Reports
    console.log('\n🚨 REPORTS:');
    console.log('─'.repeat(80));
    const reports = await client.query('SELECT * FROM reports ORDER BY created_at DESC LIMIT 10');
    if (reports.rows.length === 0) {
      console.log('No reports found');
    } else {
      reports.rows.forEach(r => {
        console.log(`Reporter: ${r.reporter_ip} -> Reported: ${r.reported_ip}`);
        console.log(`Reason: ${r.reason}`);
        console.log(`Location: ${JSON.stringify(r.location)}`);
        console.log(`Time: ${r.created_at}`);
        console.log('─'.repeat(80));
      });
    }

    // View Bans
    console.log('\n🚫 BANS:');
    console.log('─'.repeat(80));
    const bans = await client.query('SELECT * FROM bans ORDER BY created_at DESC');
    if (bans.rows.length === 0) {
      console.log('No bans found');
    } else {
      bans.rows.forEach(b => {
        const isActive = new Date(b.banned_until) > new Date();
        console.log(`IP: ${b.ip_address} - ${isActive ? '🔴 ACTIVE' : '🟢 EXPIRED'}`);
        console.log(`Reason: ${b.reason}`);
        console.log(`Until: ${b.banned_until}`);
        console.log('─'.repeat(80));
      });
    }

    // Statistics
    console.log('\n📈 STATISTICS:');
    console.log('─'.repeat(80));
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM sessions) as total_sessions,
        (SELECT COUNT(*) FROM messages) as total_messages,
        (SELECT COUNT(*) FROM reports) as total_reports,
        (SELECT COUNT(*) FROM bans WHERE banned_until > NOW()) as active_bans
    `);
    console.log(`Total Sessions: ${stats.rows[0].total_sessions}`);
    console.log(`Total Messages: ${stats.rows[0].total_messages}`);
    console.log(`Total Reports: ${stats.rows[0].total_reports}`);
    console.log(`Active Bans: ${stats.rows[0].active_bans}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

viewDatabase();
