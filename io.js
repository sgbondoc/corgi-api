// inside bin/www
const server = http.createServer(app)
 
// load and attach socket.io to http server
const io = require('../io')
io.attach(server)

// io.js
const io = require('socket.io')();
 
// listen for new connections from clients (socket)
io.on('connection', function (socket) {
  console.log("Client connected to socket.io!")
})

// io represents socket.io on the server - let's export it
module.exports = io;