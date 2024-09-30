const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pass = 1234
const userlist = []
var messageshis = []
const serverList = {}
const app = express();
const server = http.createServer(app);
const io = new Server(
    server,
    {
        cors: {
            origin: '*'
        }
    }
)

io.on('connection', (socket) => {
    console.log("user connected", socket.id)

    socket.on('Joinuser', (name) => {
        userlist.push({ id: socket.id, name: name })
        console.log(userlist)
        socket.emit('setUser', name);
    })

    socket.on('messagehistory', () => {
        socket.emit('getHistory', messageshis);
    })

    socket.on('message', (message, name) => {
        console.log('Message received:', message);
        messageshis.push({ id: socket.id, message: message, name: name })
        console.log(messageshis)
        io.emit("message", messageshis)
    })
    socket.on('disconnect', () => {
        console.log('user Disconnected:', socket.id);
        socket.broadcast.emit('userLeft', `User with ID: ${socket.id} has joined`);
    })
    socket.on('cleardata', (Password) => {
        if (pass == Password) {
            messageshis = []
            socket.emit('getHistory', messageshis);
        }
    })
})

app.get('/', (req, res) => {
    res.send("welcome the server is running")
})

server.listen(5000, () => {
    console.log('server listening on 5000')
})