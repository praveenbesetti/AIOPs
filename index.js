import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();

// --- AIOps LOGGER SETUP ---
// This part ensures everything printed to the console also goes to app.log
const logFile = fs.createWriteStream(path.join(process.cwd(), 'app.log'), { flags: 'a' });

app.get('/test-ip', async (req, res) => {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  res.send({ your_vpc_static_ip: data.ip });
});
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

const port = process.env.PORT || 8080; 

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running and listening on port ${port}`);
});
