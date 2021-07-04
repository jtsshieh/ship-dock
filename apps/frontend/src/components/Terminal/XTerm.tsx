import { MutableRefObject, useEffect, useRef } from 'react';
import { Terminal } from 'xterm';

export function XTerm({
	terminalRef,
}: {
	terminalRef: MutableRefObject<{ terminal: Terminal }>;
}) {
	const terminalDiv = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!terminalDiv.current) return;
		terminalRef.current.terminal.open(terminalDiv.current);
		const { terminal } = terminalRef.current;
		return () => terminal.dispose();
	}, [terminalRef]);

	return (
		<div css={{ width: '100%', height: '100%' }}>
			<div ref={terminalDiv} css={{ width: '100%', height: '100%' }} />
		</div>
	);
}
