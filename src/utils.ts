import { Message } from 'discord.js';
import winston from 'winston';
require('winston-daily-rotate-file');

import { sendAndCache } from './utils/discord';

require('dotenv').config();

export let Logger = winston.createLogger({
	level: 'verbose',
	transports: [
		new (winston.transports as any).DailyRotateFile({ dirname: process.env.LOG_PATH ? `${process.env.LOG_PATH}/botlogs` : './logs' }),
		new winston.transports.Console({ format: winston.format.simple() }),
		new winston.transports.File({
			filename: process.env.LOG_PATH ? `${process.env.LOG_PATH}/botlogs/error.log` : './logs/error.log',
			level: 'error',
		}),
	],
});


const urlRegex = /\b(https?:\/\/\S*\b)/g;

export function getUrl(message: Message): string | undefined {
	let url = undefined;
	if (message.attachments.size > 0) {
		if (message.attachments.first().width > 700) {
			url = message.attachments.first().url;
		}
	}

	if (message.embeds.length > 0) {
		if (message.embeds[0].image && message.embeds[0].image.width > 700) {
			url = message.embeds[0].image.url;
		}
	}

	const urls = message.content.match(urlRegex);
	if (urls) {
		url = urls[0];
	}

	return url;
}

// Escape string for use in Javascript regex
export function escapeRegExp(strings: string[]) {
	return strings.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // $& means the whole matched string
}

/**
 * Normalize a port into a number, string, or false.
 */

export function normalizePort(val:any) {
	var port = parseInt(val, 10);
  
	if (isNaN(port)) {
	  // named pipe
	  return val;
	}
  
	if (port >= 0) {
	  // port number
	  return port;
	}
  
	return false;
}
