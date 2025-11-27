const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initializeDatabase } = require('./models/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to set user ID (placeholder - would come from auth in production)
app.use((req, res, next) => {
  req.userId = req.headers['x-user-id'] || null;
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Memora API' });
});

app.use('/api', apiRoutes);

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();