// Import required packages
const express = require('express');  // Web framework for Node.js
const cors = require('cors');        // Enables Cross-Origin Resource Sharing
const app = express();              // Create Express application

// Middleware
app.use(cors());  // Allows frontend (5173) to talk to backend (3000)
app.use(express.json());  // Parses incoming JSON requests

// Test endpoint (your first API route)
app.post('/configurations', (req, res) => {
    // req.body contains the data sent from frontend
    console.log('Got configuration:', req.body);
    
    // Send response back to frontend
    res.json({ message: 'Received!' });
});

// Start server
const PORT = 3000;  // Backend server port (different from frontend's 5173)
app.listen(PORT, () => {
    console.log(`Local test server running on http://localhost:${PORT}`);
}); 