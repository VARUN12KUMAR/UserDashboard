require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const sequelize = require('./config/database');
const UserService = require('./services/UserService');
const authMiddleware = require('./middleware/auth');

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and sync models
async function initializeDatabase() {
  try {
    await sequelize.sync();
    console.log('✓ Database schema synchronized');
  } catch (error) {
    console.error('✗ Database synchronization failed:', error.message);
    throw error;
  }
}

// Socket connection counter
let connectedClients = 0;
let activeSessions = new Set();
let userFetchInterval;

// Socket.IO connection handling
io.on('connection', (socket) => {
  connectedClients++;
  activeSessions.add(socket.id);
  console.log(`✓ Client connected (${connectedClients} total)`);

  // Send initial data to the newly connected client
  UserService.fetchAndStoreUsers()
    .then(users => {
      socket.emit('initialUsers', users);
      console.log('✓ Initial user data sent to new client');
    })
    .catch(error => console.error('✗ Error sending initial data:', error.message));
  
  socket.on('disconnect', () => {
    connectedClients--;
    activeSessions.delete(socket.id);
    console.log(`✗ Client disconnected (${connectedClients} remaining)`);
  });
});

// Cleanup function
function cleanup() {
  UserService.stopPeriodicFetch(userFetchInterval);
  if (server) {
    server.close(() => {
      console.log('✓ Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', authMiddleware, require('./routes/users'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('✗ Error:', err.message);
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3000;

// Start the server
async function startServer() {
  try {
    await initializeDatabase();
    server.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      // Start periodic user fetching
      userFetchInterval = UserService.startPeriodicFetch(io);
      console.log('✓ Started periodic user fetching (every 20 seconds)');
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);

startServer(); 