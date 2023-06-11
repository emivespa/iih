#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow'; // https://github.com/sindresorhus/meow
import App from './app.js';
import {exec, execSync, spawn} from 'child_process';
import path from 'path';
import fs from 'fs';

const cli = meow(
	`
  Usage
    $ iih --host irc.libera.chat --channel '##spam' --nick minime

  Options
    --host     irc.libera.chat
    --channel  '##spam'
    --nick     minime
    --pass     your-password # WARNING: will appear on processes list.

  Examples
    $ iih --host irc.libera.chat --channel '##spam' --nick minime --pass minipass
`,
	{
		importMeta: import.meta,
		flags: {
			host: {
				type: 'string',
				default: 'irc.libera.chat',
			},
			channel: {
				type: 'string',
				default: '#libera',
			},
			nick: {
				type: 'string',
				default: process.env['USER'],
			},
			pass: {
				type: 'string',
			},
		},
	},
);

// If not already runnign, spawn ii.
// On exit, only kill it if we spawned it.
const isIiRunning = () => {
	try {
		execSync('pidof ii');
		return true;
	} catch {
		return false;
	}
};
if (!isIiRunning()) {
	const iiProcess = spawn(
		'ii',
		['-s', `${cli.flags.host}`, '-n', `${cli.flags.nick}`],
		{
			detached: true,
			stdio: 'ignore',
		},
	);
	iiProcess.unref();
	const iiPid = iiProcess.pid;
	process.on('exit', () => {
		iiPid && process.kill(iiPid, 'SIGTERM');
		setTimeout(() => {
			process.exit();
		}, 1000);
	});
	process.on('SIGINT', () => {
		iiPid && process.kill(iiPid, 'SIGTERM');
		setTimeout(() => {
			process.exit();
		}, 1000);
	});
}

const writeToFifo = (s: string, fifo: string) => {
	// const writeableStream = fs.createWriteStream(fifo, {flags: 'a'});
	// writeableStream.write(s);
	// writeableStream.end();
	exec(`echo "${s}" >${fifo}`);
};

// Join send the /j(oin) message whenever the in file starts existing.
const HOME = process.env['HOME'];
const inFile = path.resolve(`${HOME}/irc/${cli.flags.host}/in`);
const writeOnceAvailable = () => {
	fs.access(inFile, fs.constants.F_OK, err => {
		if (err) {
			console.error(`${inFile} doesn't exist yet, waiting 1000ms...`);
			setTimeout(writeOnceAvailable, 1000);
			return;
		}
		if (cli.flags.pass) {
			const nick = `/m NickServ IDENTIFY ${cli.flags.nick} ${cli.flags.pass}\n`;
			writeToFifo(nick, inFile);
		}
		const join = `/j ${cli.flags.channel}\n`;
		writeToFifo(join, inFile);
		render(
			<App
				channel={cli.flags.channel}
				host={cli.flags.host}
				nick={cli.flags.nick}
			/>,
		);
	});
};
writeOnceAvailable();
