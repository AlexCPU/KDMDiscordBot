import { Message } from 'discord.js';
import NodeCache from 'node-cache';

export function getEmoteOrString(message: Message, emojiName: string, defaultString: string): string {
	if (message.guild) {
		let emoji = message.guild.emojis.find((emoji) => emoji.name === emojiName);
		if (emoji) {
			return emoji.toString();
		}
	}
	return defaultString;
}

export function getDieEmoji(message: Message, value: number, dieType: number): string {
	if (dieType===1) {
		switch(value)
		{
			case 1:
				return getEmoteOrString(message, 'e_1', '1');
				break;
			
			case 2:
				return getEmoteOrString(message, 'e_2', '2');
				break;
			
			case 3:
				return getEmoteOrString(message, 'e_3', '3');
				break;
			
			case 4:
				return getEmoteOrString(message, 'e_4', '4');
				break;
			
			case 5:
				return getEmoteOrString(message, 'e_5', '5');
				break;

			case 6:
				return getEmoteOrString(message, 'e_6', '6');
				break;
			
			case 7:
				return getEmoteOrString(message, 'e_7', '7');
				break;
			
			case 8:
				return getEmoteOrString(message, 'e_8', '8');
				break;
			
			case 9:
				return getEmoteOrString(message, 'e_9', '9');
				break;
			
			case 10:
				return getEmoteOrString(message, 'e_lantern', '10');
				break;			
		}
	}
	else if (dieType===2) {
		switch(value)
		{
			case 1:
				return getEmoteOrString(message, 'hit_waist', 'Waist');
				break;
			
			case 2:
				return getEmoteOrString(message, 'hit_legs', 'Legs');
				break;
			
			case 3:
				return getEmoteOrString(message, 'hit_head', 'Head');
				break;
			
			case 4:
				return getEmoteOrString(message, 'hit_arms', 'Arms');
				break;
			
			case 5:
			case 6:
				return getEmoteOrString(message, 'hit_body', 'Body');
				break;

		}
	}
	return "unknown DieType";
}

export let MessageCache = new NodeCache({ stdTTL: 600 });

export async function sendAndCache(message: Message, content: any, asReply: boolean = false) {
	let myReply;

	if (asReply) {
		myReply = await message.reply(content);
	} else {
		myReply = await message.channel.send(content);
	}

	if (myReply instanceof Message) {
		let entries = MessageCache.get<string[]>(message.id);
		if (entries) {
			entries.push(myReply.id);
			MessageCache.set(message.id, entries);
		} else {
			MessageCache.set(message.id, [myReply.id]);
		}
	}
}

export async function deleteOldReplies(message: Message, titleToDelete: string) {
	let messages = await message.channel.fetchMessages({ limit: 100 });

	for (let msg of messages.values()) {
		if (msg.author.id === message.client.user.id) {
			// This is one of the bot's old messages
			if (msg.embeds && msg.embeds.length > 0) {
				if (msg.embeds[0].title === titleToDelete) {
					try {
						await msg.delete();
					} catch {
						// Ok to ignore
					}
				}
			}
		}
	}
}
