const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');

// Load the protobuf file
const PROTO_PATH = './proto/service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const LoggingService = protoDescriptor.LoggingService;

// Create the gRPC server
const server = new grpc.Server();

// Function to handle logging requests
function logMessage(call, callback) {
    const logEntry = `Received log: ${call.request.message}\n`;
    
    // Append log entry to logs.txt
    fs.appendFile('logs.txt', logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
            callback(null, { status: 'Failed' });
            return;
        }
        console.log('Log saved:', logEntry);
        callback(null, { status: 'Success' });
    });
}

// Add service to server
server.addService(LoggingService.service, { logMessage });

// Start the server
const PORT = '50051';
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        console.error(`Failed to start gRPC server: ${error.message}`);
        return;
    }
    console.log(`🚀 gRPC server running on port ${port}`);
});
