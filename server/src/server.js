const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start Express server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`EventHive API Server is running on port ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
  });
});

