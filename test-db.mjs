import mysql from 'mysql2/promise.js';   // ES-module import [web:23][web:44]

const connectionConfig = {
  host: 'myapp-database.cnqaak2s2fdr.eu-north-1.rds.amazonaws.com',   // myapp-database....rds.amazonaws.com
  port: 3306,
  user: 'admin',
  password: 'blossoms.sos',
  database: 'myapp-database',
};

async function testConnection() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Connected to MySQL RDS');

    const [rows] = await connection.query('SELECT NOW() AS now');
    console.log('Server time:', rows[0].now);

    await connection.end();
  } catch (err) {
    console.error('❌ Connection error:', err);
  }
}

testConnection();
