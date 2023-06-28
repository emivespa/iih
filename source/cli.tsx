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
        default: `${process.env['USER']}`.padStart(2, '0'), // Nicks can't be 1 character.
      },
      pass: {
        type: 'string',
      },
    },
  },
);

const hostIn = path.resolve(`${process.env['HOME']}/irc/${cli.flags.host}/in`);

// If not already running, spawn ii.
// On exit, only kill it if we spawned it.
const isIiRunning = () => {
  try {
    execSync('pidof ii');
    if (!fs.existsSync(hostIn)) {
      // Maybe ii is running for another host.
      return false;
    }
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
  fs.access(fifo, fs.constants.F_OK, err => {
    if (err) {
      if (process.env['DEBUG']) {
        console.info(`${fifo} doesn't exist, waiting 1000ms`);
      }
      setTimeout(() => {
        writeToFifo(s, fifo);
      }, 1000);
      return;
    }
    exec(`echo "${s}" >${fifo}`);
    if (process.env['DEBUG']) {
      console.info(`wrote ${s} to ${fifo}`);
    }
  });
};

// Join send the /j(oin) message whenever the in file starts existing.
// const hostIn = path.resolve(`${process.env['HOME']}/irc/${cli.flags.host}/in`);
const nickservIn = path.resolve(
  `${process.env['HOME']}/irc/${cli.flags.host}/nickserv/in`,
);
writeToFifo(`/j ${cli.flags.channel}\n`, hostIn);
if (cli.flags.pass) {
  writeToFifo(`/j nickserv\n`, hostIn);
  writeToFifo(`IDENTIFY ${cli.flags.nick} ${cli.flags.pass}\n`, nickservIn);
}
render(
  <App
    channel={cli.flags.channel}
    host={cli.flags.host}
    nick={cli.flags.nick}
  />,
);
