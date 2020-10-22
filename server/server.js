const WebSocketServer = require('websocket').server;
const path = require('path');
const express = require('express'),
    app = express(),
    http = require('http').createServer(app);

const host = '127.0.0.1'
const port = 3000

app.use(express.static(path.join(__dirname, '../app/')))

app.get('/', (req, res) => res.render('index'))

http.listen(port, host, () => console.log(`Server listens http://${host}:${port}`))

const wsServer = new WebSocketServer({
    httpServer: http
});

wsServer.on('request', function (request) {
    const connection = request.accept('echo-protocol', request.origin);
    let intervalId;

    connection.on('message', function ({ utf8Data: message }) {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = undefined;
        }

        intervalId = setInterval(() => {
            connection.send(message);
        }, 1000)
    });
    connection.on('close', () => {
        console.log('closed');
    });
});