import fs from 'fs';
import { Client } from 'discord.js';

import { Logger, getUrl, escapeRegExp } from './utils';
import { MessageCache, sendAndCache, getEmoteOrString, getDieEmoji } from './utils/discord';

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
			sendAndCache(message, 'This is my help message, it should explain all the commands, but it isn\' written yet');
			break;
		case 'roll':
			sendAndCache(message, message.member.displayName + ' rolled a ');
			switch(args[1]){
				case 'hit':
					sendAndCache(message,getDieEmoji(message,Math.ceil(Math.random()*6),2))
					break;
				case 'd10':
				default:
					sendAndCache(message,getDieEmoji(message,Math.ceil(Math.random()*10),1))
					break;

			}
			//message.delete()
			break;
	}  
});
