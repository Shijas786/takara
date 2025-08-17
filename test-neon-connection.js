// Test script to verify Neon database connection
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function testConnection() {
  try {
    console.log('🔌 Testing Neon database connection...');
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found in environment variables');
      return;
    }
    
    console.log('✅ DATABASE_URL found');
    console.log('🔗 Connecting to database...');
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Test basic connection
    const result = await sql`SELECT version()`;
    console.log('✅ Database connection successful!');
    console.log('📊 PostgreSQL version:', result[0].version);
    
    // Test if tables exist
    console.log('\n🔍 Checking if tables exist...');
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('📋 Found tables:', tables.map(t => t.table_name));
    
    // Test if sample data exists
    console.log('\n📊 Checking sample data...');
    
    const influencerCount = await sql`SELECT COUNT(*) as count FROM influencers`;
    console.log('👥 Influencers count:', influencerCount[0].count);
    
    if (influencerCount[0].count > 0) {
      const sampleInfluencer = await sql`SELECT name, handle, style FROM influencers LIMIT 1`;
      console.log('🎯 Sample influencer:', sampleInfluencer[0]);
    }
    
    console.log('\n🎉 All tests passed! Your Neon migration is working correctly.');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('connection')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Check if your DATABASE_URL is correct');
      console.log('2. Verify your Neon database is running');
      console.log('3. Make sure you ran the schema from neon-schema.sql');
      console.log('4. Check if your IP is whitelisted (if using IP restrictions)');
    }
  }
}

testConnection(); 