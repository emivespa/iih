import React from 'react';

import ChatHistory from './history.js';
import ChatInput from './input.js';

type Props = {
	host: string | undefined;
	channel: string | undefined;
	nick: string | undefined;
};

export default function App({
	host = 'irc.libera.chat',
	channel = '#libera',
	nick,
}: Props) {
	return (
		<>
			<ChatHistory host={host} channel={channel} nick={nick} />
			<ChatInput host={host} channel={channel} nick={nick} />
		</>
	);
}
