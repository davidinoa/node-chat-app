const expect = require('expect');
const { generateMessage } = require('./message');

describe('generateMessage', () => {
	it('should generate the correct message object', () => {
		const from = 'David';
		const text = 'Testing yerr';
		const message = generateMessage(from, text);
		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({ from, text });
	});
});
