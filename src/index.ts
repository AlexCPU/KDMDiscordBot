import fs from 'fs';
import { Client } from 'discord.js';

import { Logger, getUrl, escapeRegExp } from './utils';
import { MessageCache, sendAndCache } from './utils/discord';

require('dotenv').config();

const client = new Client();

const prefix = '!';

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
	Logger.info('Bot logged in', { bot_tag: client.user.tag });
});

client.on('messageDelete', (message) => {
	let replies: string[] | undefined = MessageCache.get(message.id);
	if (replies) {
		MessageCache.del(message.id);

		replies.forEach((reply) => {
			message.channel
				.fetchMessage(reply)
				.then((message) => {
					if (message) {
						message.delete();
					}
				})
				.catch(() => {
					// Don't care
				});
		});
	}
});

client.on('message', (message) => {
	if (message.author.id === client.user.id) {
		// do nothing when the person sending the message is us.
		return;
	}

	Logger.verbose('Message received', {
		id: message.id,
		author: { id: message.author.id, username: message.author.username },
		guild: message.guild ? message.guild.toString() : 'DM',
		channel: message.channel.toString(),
		content: message.content,
	});

	if (message.author.bot) {
		// do noting if the person sending the message is a bot.
		return;
	}

	let args = message.content.substring(prefix.length).split(" ");

	switch(args[0]){
		case 'help':
			sendAndCache(message, 'This is my help message');
			break;
		case 'roll':
			sendAndCache(message, message.member.displayName + ' rolled a ' + Math.ceil(Math.random() * 10));
			break;
	}  
});
