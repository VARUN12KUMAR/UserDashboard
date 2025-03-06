const { Sequelize } = require('sequelize');
require('dotenv').config();

// Determine the database host based on environment
const dbHost = process.env.NODE_ENV === 'production' ? 'db' : 'localhost';
const dbUser = process.env.DB_USER || 'user';
const dbPassword = process.env.DB_PASSWORD || 'password';
const dbName = process.env.DB_NAME || 'userdb';
const dbPort = process.env.DB_PORT || 5432;

const dbUrl = process.env.DATABASE_URL || 
  `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

// Only log the connection attempt, not the queries
console.log('Attempting database connection to:', dbUrl.replace(/:([^:@]+)@/, ':****@'));

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false, // Disable SQL query logging
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  retry: {
    max: 5,
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/
    ],
    backoffBase: 1000,
    backoffExponent: 1.5,
  }
});

// Test the connection with minimal logging
async function testConnection() {
  let retries = 5;
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log('✓ Database connection established successfully');
      return;
    } catch (error) {
      console.error('✗ Database connection failed:', error.message);
      retries -= 1;
      if (retries === 0) {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }
      console.log(`Retrying in 5 seconds... (${retries} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

testConnection();

module.exports = sequelize; 