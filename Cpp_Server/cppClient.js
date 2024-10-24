const net = require('net');
const client = new net.Socket();

client.connect(5555, '127.0.0.1', () => {
    console.log('Connected to C++ server');
});

client.on('data', (data) => {
    console.log('Data event triggered');
    const vidsFromCPP = data.toString();
    console.log('Received vids from C++ server:', vidsFromCPP);
    // Process data...
});

client.on('close', () => {
    console.log('Connection closed');
});

client.on('error', (err) => {
    console.error('Connection error:', err);
});

module.exports = client;