import React, { useContext } from 'react';
import { LoadingContext } from './LoadingContext';
import { LinearProgress } from '@material-ui/core';

export function ProgressBar() {
	const { loading } = useContext(LoadingContext);

	if (!loading) return null;

	return (
		<LinearProgress
			css={{ position: 'absolute', width: '100%', left: 0, top: 0 }}
		/>
	);
}
