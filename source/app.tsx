import React from 'react';

import ChatHistory from './history.js';
import ChatInput from './input.js';

type Props = {
	host: string | undefined;
	channel: string | undefined;
};

export default function App({host, channel}: Props) {
	return (
		<>
			<ChatHistory host={host} channel={channel} />
			<ChatInput host={host} channel={channel} />
		</>
	);
}
