const socket = io();

function scrollToBottom() {
	// Selectors
	const messages = $('#messages');
	const newMessage = messages.children('li:last-child');
	// Heights
	const clientHeight = messages.prop('clientHeight');
	const scrollTop = messages.prop('scrollTop');
	const scrollHeight = messages.prop('scrollHeight');
	const newMessageHeight = newMessage.innerHeight();
	const lastMessageHeight = newMessage.prev().innerHeight();

	if (
		clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
		scrollHeight
	) {
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect', () => {
	const params = $.deparam(window.location.search);

	socket.emit('join', params, (err) => {
		if (err) {
			alert(err);
			window.location.href = '/';
		} else {
			console.log('No error');
		}
	});
});

socket.on('disconnect', () => {
	console.log('Disconnected from server');
});

socket.on('updateUserList', (users) => {
	const ol = $('<ol></ol>');

	users.forEach((user) => {
		ol.append($('<li></li>').text(user));
	});

	$('#users').html(ol);
});

socket.on('newMessage', (message) => {
	const formattedTime = moment(message.createdAt).format('h:mm a');
	const template = $('#message-template').html();
	const html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	$('#messages').append(html);
	scrollToBottom();
});

socket.on('newLocationMessage', (message) => {
	const formattedTime = moment(message.createdAt).format('h:mm a');
	const template = $('#location-message-template').html();
	const html = Mustache.render(template, {
		url: message.url,
		from: message.from,
		createdAt: formattedTime
	});
	$('#messages').append(html);
	scrollToBottom();
});

$('#message-form').on('submit', (e) => {
	e.preventDefault();
	const messageTextbox = $('[name=message]');
	socket.emit('createMessage', { text: messageTextbox.val() }, () => {
		messageTextbox.val('');
	});
});

const locationButton = $('#send-location');
locationButton.on('click', () => {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser.');
	}

	locationButton.attr('disabled', 'disabled').text('Sending location...');

	navigator.geolocation.getCurrentPosition(
		(position) => {
			locationButton.removeAttr('disabled').text('Send location');
			socket.emit('createLocationMessage', {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			});
		},
		() => {
			locationButton.removeAttr('disabled').text('Send location');
			alert('Unable to fetch location.');
		}
	);
});
