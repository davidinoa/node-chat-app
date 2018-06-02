const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.emit('newMessage', {
		from: 'David',
		text: 'Whats going on?',
		createdAt: new Date()
	});

	socket.on('createMessage', (message) => {
		console.log('Creating message', message);
	});

	socket.on('disconnect', () => {
		console.log('User was disconnected');
	});
});

server.listen(3000, () => console.log(`Server up running on port ${port}`));
