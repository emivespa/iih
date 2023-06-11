import React, {useState} from 'react';

import {Box, Text} from 'ink';

import TextInput from 'ink-text-input';

import fs from 'fs';
import path from 'path';

type Props = {
	host: string | undefined;
	channel: string | undefined;
	nick: string | undefined;
};
export default function ChatInput({host, channel, nick}: Props) {
	// https://github.com/vadimdemedes/ink-text-input#usage
	//
	// TODO: use uncontrolled variant to prevent flicker?
	// - uncontrolled variant seems to be WIP as of 20230604
	const [query, setQuery] = useState('');
	const handleSubmit = () => {
		const HOME = process.env['HOME'];
		const inFile = path.resolve(`${HOME}/irc/${host}/${channel}/in`);
		fs.access(inFile, fs.constants.F_OK, err => {
			if (err) {
				console.error(`${inFile} does not exist`);
				return;
			}
			const writeableStream = fs.createWriteStream(inFile, {flags: 'a'});
			writeableStream.write(`${query}\n`);
			writeableStream.end();
		});
		setQuery('');
	};
	return (
		<Box width="100%">
			<Box marginRight={1}>
				<Text>&lt;{nick}&gt;</Text>
			</Box>
			<Box>
				<TextInput value={query} onChange={setQuery} onSubmit={handleSubmit} />
			</Box>
		</Box>
	);
}
