const net = require('net');
require('custom-env').env(process.env.NODE_ENV, './config');

const TCP_SERVER_HOST = process.env.BLOOMFILTER_IP; // this is the ip of the vm i run the tcp server on, change it for what you need
const TCP_SERVER_PORT = parseInt(process.env.BLOOMFILTER_PORT);

// Create a new TCP socket client:
const client = new net.Socket();

// Connect to the TCP server:
client.connect(TCP_SERVER_PORT, TCP_SERVER_HOST, () => {
    console.log("Connected to TCP server " + TCP_SERVER_HOST + ":" + TCP_SERVER_PORT);
    client.write(process.env.BLOOMFILTER_SIZE + " " + process.env.BLOOMFILTER_HASH_FUNCS + " : " + process.env.BLACKLISTED_URLS);
});

// Handle connection errors:
client.on('error', (error) => {
    console.error('Error connecting to TCP server:', error);
});

module.exports = {
    send: (data, callback) => {
        client.write(data);
        // Listen for the server's response:
        client.once('data', (data) => {
            callback(null, data.toString()); // Convert the buffer to a string and pass it to the callback
        });
    },
    close: () => {
        client.end();
    }
};
