import React from 'react';

import {Text} from 'ink';

export default function Line({line}: {line: string}) {
	const [unixDate, user, ...textTokens] = `${line}`.split(' ');
	const text = textTokens.join(' ');
	const time = new Date(Number(unixDate) * 1000).toLocaleTimeString();
	// The userColor is a bit more complex. Let's get a random hex:
	const userColor = ((s: string): string | undefined => {
		// This isn't random so the distribution might be slightly biased.
		const colors = [
			// https://github.com/chalk/chalk#colors
			/* 'black', */
			'red',
			'green',
			'yellow',
			'blue',
			'magenta',
			'cyan',
			'white',
			'blackBright',
			'redBright',
			'greenBright',
			'yellowBright',
			'blueBright',
			'magentaBright',
			'cyanBright',
			/* 'whiteBright', */
		];
		const sum = s.split('').reduce((acc, i) => {
			return acc + i.charCodeAt(0);
		}, 0);
		const i = sum % colors.length;
		return colors[i];
	})(user ? user : '0');
	return (
		<Text>
			<Text dimColor>{time} </Text>
			<Text color={userColor}>{user} </Text>
			<Text>{text}</Text>
		</Text>
	);
}
