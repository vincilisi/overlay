// 🚀 ULTRA MINIMAL SERVER per TEST RENDER
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware basics
app.use(express.static(__dirname));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Stardew Overlay MEGA PERFORMANCE!',
        timestamp: new Date().toISOString()
    });
});

// Root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start
app.listen(PORT, () => {
    console.log(`🚀 MEGA SERVER su porta ${PORT}`);
    console.log(`🌍 Health check: /health`);
});