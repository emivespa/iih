import React, { useState, useEffect, } from 'react';

import {
  Box,
  Static,
  Text,
} from 'ink';

import fs from 'fs'
import path from 'path'

import TextInput from 'ink-text-input';

type Props = {
	host: string | undefined;
	channel: string | undefined;
};

type LineProps = {
	line: string | undefined;
};

const Line = ({line}: LineProps) => {
  const [unixDate, user, ...textTokens] = `${line}`.split(' ')
  const text = textTokens.join(' ')
  const time = new Date(Number(unixDate) * 1000).toLocaleTimeString()
  // The userColor is a bit more complex. Let's get a random hex:
  const userColor = (s: string): string => {
    const base36UserChars = `${s}`.replaceAll(/[^0-9A-Za-z]/g, '')
    const userNumber = parseInt(base36UserChars, 36)
    const userHex = userNumber.toString(16)
    return '#' + (userHex.length >= 6 ? userHex : '7f7f7f')
  }
  return (
    <Box width="100%">
      <Box marginRight={1}><Text dimColor>{time}</Text></Box>
      <Box marginRight={1}><Text color={userColor(user ? user : '0')}>{user}</Text></Box>
      <Box><Text>{text}</Text></Box>
    </Box>
  )
}

const ChatHistory = ({host, channel}: Props) => {
	const [lines, setLines] = useState<string[]>([])
  const HOME = process.env['HOME']
  const outFile = path.resolve(`${HOME}/irc/${host}/${channel}/out`)
  const updateLines = () => {
    fs.readFile(outFile, 'utf8', (err, data) => {
      if (err) throw err
      const newLines = data.split('\n').filter(line => line !== '')
      setLines(newLines)
    })
  }
	useEffect(() => {
    // Create the outFile if it doesn't already exist.
    // ii would create it anyway, but we're here early.
    if (!fs.existsSync(outFile)) {
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, '');
    }
    // else {
    // }
    updateLines()
    const watcher = fs.watch(outFile)
    watcher.on('change', updateLines)
    return () => {
      watcher.close()
    }
	}, [])
	return (
    <Static items={lines}>
      {(line, i) => (
        <Line key={i} line={line} />
      )}
    </Static>
	)
}

const ChatInput = ({host, channel}: Props) => {
	// https://github.com/vadimdemedes/ink-text-input#usage
  //
	// TODO: use uncontrolled variant to prevent flicker?
  // - uncontrolled variant seems to be WIP as of 20230604
	const [query, setQuery] = useState('');
  const handleSubmit = () => {
    const HOME = process.env['HOME']
    const inFile = path.resolve(`${HOME}/irc/${host}/${channel}/in`)
    fs.access(inFile, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`${inFile} does not exist`)
        return
      }
      const writeableStream = fs.createWriteStream(inFile, { flags: 'a'})
      writeableStream.write(`${query}\n`)
      writeableStream.end()
    })
    setQuery('')
  }
	return (
		<Box width="100%">
			<Box marginRight={1}>
        <Text>&gt;</Text>
      </Box>
      <Box>
        <TextInput value={query} onChange={setQuery} onSubmit={handleSubmit}/>
      </Box>
		</Box>
	);
};

export default function App({host, channel}: Props) {
	return (
		<>
			<ChatHistory host={host} channel={channel} />
			<ChatInput host={host} channel={channel} />
		</>
	);
}
