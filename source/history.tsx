import React, {useState, useEffect} from 'react';

import {Static} from 'ink';

import Line from './line.js';

import fs from 'fs';
import path from 'path';

type Props = {
	host: string | undefined;
	channel: string | undefined;
	nick: string | undefined;
};

export default function ChatHistory({host, channel}: Props) {
	const [lines, setLines] = useState<string[]>([]);
	const HOME = process.env['HOME'];
	const outFile = path.resolve(`${HOME}/irc/${host}/${channel}/out`);
	const updateLines = () => {
		fs.readFile(outFile, 'utf8', (err, data) => {
			if (err) throw err;
			const newLines = data.split('\n').filter(line => line !== '');
			setLines(newLines);
		});
	};
	useEffect(() => {
		// Create the outFile if it doesn't already exist.
		// ii would create it anyway, but we're here early.
		if (!fs.existsSync(outFile)) {
			fs.mkdirSync(path.dirname(outFile), {recursive: true});
			fs.writeFileSync(outFile, '');
		}
		// else {
		// }
		updateLines();
		const watcher = fs.watch(outFile);
		watcher.on('change', updateLines);
		return () => {
			watcher.close();
		};
	}, []);
	return (
		<Static items={lines}>{(line, i) => <Line key={i} line={line} />}</Static>
	);
}
