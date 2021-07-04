import React from 'react';
import { Button } from '@material-ui/core';
import Link from 'next/link';

export default function Index() {
	return (
		<Link href="/app">
			<Button component="a" variant="contained" color="primary">
				Launch app
			</Button>
		</Link>
	);
}
