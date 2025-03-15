const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Load proto file
const PROTO_PATH = path.join(__dirname, "proto", "service.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).LoggingService; // Ensure LoggingService is accessed

console.log("🔵 Client started... Connecting to gRPC Server...");

// Create gRPC client
const client = new proto(
    "localhost:50051",
    grpc.credentials.createInsecure()
);

console.log("✅ Connected to Server. Sending request...");

// Send a log message
client.logMessage({ message: "Hello, this is a test log!" }, (error, response) => {
    if (error) {
        console.error("❌ Error:", error);
    } else {
        console.log("✅ Server Response:", response.status);
    }
});
