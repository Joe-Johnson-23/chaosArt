// Change require to import
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());  // Allows frontend (5173) to talk to backend (3000)
app.use(express.json());  // Parses incoming JSON requests

// Test endpoint (your first API route)
app.post('/configurations', (req, res) => {
    console.log('Received configuration:', req.body);
    res.json({ 
        success: true, 
        message: 'Configuration saved',
        data: req.body 
    });
});

// Start server
const PORT = 3000;  // Backend server port (different from frontend's 5173)
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 