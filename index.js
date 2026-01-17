import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();

// --- AIOps LOGGER SETUP ---
// This part ensures everything printed to the console also goes to app.log
const logFile = fs.createWriteStream(path.join(process.cwd(), 'app.log'), { flags: 'a' });

const logToFile = (message) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${message}\n`;
    logFile.write(formattedMessage);
    process.stdout.write(formattedMessage); // Still show it in the terminal
};

// Override console.log and console.warn
console.log = (msg) => logToFile(`INFO: ${msg}`);
console.warn = (msg) => logToFile(`WARN: ${msg}`);
console.error = (msg) => logToFile(`ERROR: ${msg}`);
// ---------------------------

process.on('warning', (warning) => {
    console.warn("🤖 AIOps Warning Detector: " + warning.message);
});

app.get('/', (req, res) => {
    res.send("AIOps Backend is Running");
});

// TEST ROUTE: Trigger a manual error to see it in CloudWatch
app.get('/error', (req, res) => {
    console.error("CRITICAL: Manual system test triggered!");
    res.status(500).send("Error logged to AIOps pipeline.");
});

app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});