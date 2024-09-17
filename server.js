const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); 
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); //  payload size limit
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); 

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client')));

// API routes
const apiRouter = require('./server/routes/api');
app.use('/api', apiRouter);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});