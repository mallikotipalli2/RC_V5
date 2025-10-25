-- RandomChips Database Schema

-- Sessions table: stores chat session information
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY,
  user1_ip VARCHAR(45) NOT NULL,
  user2_ip VARCHAR(45) NOT NULL,
  user1_name VARCHAR(50),
  user2_name VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP
);

-- Create index on IP addresses for faster lookups
CREATE INDEX IF NOT EXISTS idx_sessions_user1_ip ON sessions(user1_ip);
CREATE INDEX IF NOT EXISTS idx_sessions_user2_ip ON sessions(user2_ip);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);

-- Messages table: stores all chat messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  sender_ip VARCHAR(45) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for message queries
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Reports table: stores user reports with chat logs
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY,
  reporter_ip VARCHAR(45) NOT NULL,
  reported_ip VARCHAR(45) NOT NULL,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  reason VARCHAR(50) NOT NULL,
  chat_logs JSONB,
  location JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for report queries
CREATE INDEX IF NOT EXISTS idx_reports_reported_ip ON reports(reported_ip);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_session_id ON reports(session_id);

-- Bans table: stores IP bans with duration
CREATE TABLE IF NOT EXISTS bans (
  id UUID PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  banned_until TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for ban queries
CREATE INDEX IF NOT EXISTS idx_bans_ip_address ON bans(ip_address);
CREATE INDEX IF NOT EXISTS idx_bans_banned_until ON bans(banned_until);

-- Function to clean up old data (optional, for maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  -- Delete messages older than 30 days
  DELETE FROM messages WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Delete sessions older than 30 days
  DELETE FROM sessions WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Delete expired bans
  DELETE FROM bans WHERE banned_until < NOW();
  
  -- Delete old reports (keep for 90 days)
  DELETE FROM reports WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;
