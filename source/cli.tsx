#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow'; // https://github.com/sindresorhus/meow
import App from './app.js';
import { spawn } from 'child_process';
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

	Examples
	  $ iih --host irc.libera.chat --channel '##spam'
`,
  {
    importMeta: import.meta,
    flags: {
      host: {
        type: 'string',
        shortFlag: 'h',
        default: 'irc.libera.chat',
      },
      channel: {
        type: 'string',
        shortFlag: 'c',
        default: '#libera',
      },
      nick: {
        type: 'string',
        shortFlag: 'n',
        default: process.env['USER'],
      },
    },
  },
);

// Start ii in the background:
// TODO: don't if there are 'in' fifos present
const iiProcess = spawn(
  'ii',
  ['-s', `${cli.flags.host}`, '-n', `${cli.flags.nick}`],
  {
    detached: true,
    stdio: 'ignore',
  },
);
iiProcess.unref();
process.on('SIGINT', () => {
  iiProcess.kill();
  process.exit();
});

// Join send the /j(oin) message whenever the in file starts existing.
const HOME = process.env['HOME'];
const inFile = path.resolve(`${HOME}/irc/${cli.flags.host}/in`);
const j = () => {
  fs.access(inFile, fs.constants.F_OK, err => {
    if (err) {
      console.error(`${inFile} doesn't exist yet, waiting 1000ms...`);
      setTimeout(j, 1000);
      return;
    }
    const writeableStream = fs.createWriteStream(inFile, { flags: 'a' });
    writeableStream.write(`/j ${cli.flags.channel}\n`);
    writeableStream.end();
    console.log('sent the /j(oin) msg');
    render(
      <App
        channel={cli.flags.channel}
        host={cli.flags.host}
        nick={cli.flags.nick}
      />,
    );
  });
};
j();
