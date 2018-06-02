const socket = io();

socket.on('connect', () => {
	console.log('Connected to server');

	socket.emit('createMessage', {
		from: 'Dave',
		text: 'Hey! This is Dave'
	});
});

socket.on('disconnect', () => {
	console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
	console.log('Got new message', message);
});
