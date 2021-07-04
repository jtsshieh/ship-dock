import { Terminal } from 'xterm';
import { useEffect, useRef } from 'react';
import { FitAddon } from 'xterm-addon-fit';
import { XTerm } from './XTerm';
import { grey } from '@material-ui/core/colors';

export default function LogPanel({ id }: { id: string }) {
	const terminal = new Terminal({
		fontFamily: 'JetBrains Mono',
		theme: {
			background: grey[900],
		},
	});
	const xtermRef = useRef<{ terminal: Terminal }>({
		terminal,
	});

	useEffect(() => {
		const logSource = new EventSource(`/api/containers/${id}/logs`);
		const fitAddon = new FitAddon();
		xtermRef.current.terminal.loadAddon(fitAddon);
		const captureLog = (ev: MessageEvent) =>
			xtermRef.current.terminal.write(ev.data);

		const fitTerminal = () => setTimeout(() => fitAddon.fit(), 500);
		logSource.addEventListener('message', captureLog);
		window.addEventListener('resize', fitTerminal);
		fitTerminal();

		return () => {
			logSource.removeEventListener('message', captureLog);
			window.removeEventListener('resize', fitTerminal);
		};
	}, [id]);

	return <XTerm terminalRef={xtermRef} />;
}
