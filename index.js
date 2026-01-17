import express from 'express';

const app = express();

// AIOps Watcher: Catching unhandled errors before they crash the server
process.on('warning', (warning) => {
    console.warn("🤖 AIOps Warning Detector:", warning.message);
    // In a real AWS setup, this would be sent to CloudWatch immediately
});

app.get('/', (req, res) => {
    res.send("AIOps Backend is Running");
});

app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});