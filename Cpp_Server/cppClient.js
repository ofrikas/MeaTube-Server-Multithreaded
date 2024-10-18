const net = require('net');
const client = new net.Socket();

// Replace '127.0.0.1' with the actual IP address of your C++ server
//  5555  the actual port number is C++ server is listening on
client.connect(5555, '127.0.0.1', () => {
    console.log('Connected to C++ server');
});

// Handle incoming messages from the C++ server
client.on('data', (data) => {
    console.log('Received: ' + data);
    // Process data...
});

// Handle connection close
client.on('close', () => {
    console.log('Connection closed');
});

// Export the client for use in other files
module.exports = client;