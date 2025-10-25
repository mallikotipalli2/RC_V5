import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDatabase() {
  try {
    await client.connect();
    console.log('Connected to Railway PostgreSQL');

    const schema = fs.readFileSync('./db/schema.sql', 'utf8');
    await client.query(schema);
    
    console.log('✅ Database schema initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await client.end();
  }
}

initDatabase();
