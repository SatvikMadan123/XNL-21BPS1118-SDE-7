const express = require('express');
const fs = require('fs');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const app = express();
const PORT = 5000;
const LOG_FILE = 'logs.txt';

// Middleware to parse JSON requests
app.use(express.json());

// Load the gRPC service definition
const PROTO_PATH = './proto/service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const LoggingService = grpc.loadPackageDefinition(packageDefinition).LoggingService;

// Connect to gRPC server
const client = new LoggingService('localhost:4000', grpc.credentials.createInsecure());

// Health check endpoint
app.get('/', (req, res) => {
    res.send({ status: 'API is running', grpcServer: 'Connected' });
});

// Fetch logs from logs.txt
app.get('/logs', (req, res) => {
    if (!fs.existsSync(LOG_FILE)) {
        return res.status(404).json({ error: 'Logs not found' });
    }
    const logs = fs.readFileSync(LOG_FILE, 'utf-8');
    res.json({ logs: logs.split('\n').filter(line => line) });
});

// Send log to gRPC server
app.post('/log', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    client.logMessage({ message }, (err, response) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to send log to gRPC server', details: err.message });
        }
        res.json({ status: 'Log sent successfully', response });
    });
});

// Start the API server
app.listen(PORT, () => {
    console.log(`✅ API is running on http://localhost:${PORT}`);
});
