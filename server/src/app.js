const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// Middleware setup
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in development
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EventHive API',
    version: '1.0.0',
    documentation: '/api/v1/health',
  });
});

// Mount API v1
app.use('/api/v1', apiRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;

