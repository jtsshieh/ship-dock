import { useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grow,
	LinearProgress,
} from '@material-ui/core';

export function ConfirmDialog({
	title,
	content,
	action,
	callback,
	open,
	handleClose,
}: {
	title: string;
	content: string;
	action: string;
	callback: () => void;
	open: boolean;
	handleClose: () => void;
}) {
	const [loading, setLoading] = useState(false);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			TransitionComponent={Grow}
			disableBackdropClick={loading}
			disableEscapeKeyDown={loading}
		>
			{loading && <LinearProgress />}
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{content}</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} disabled={loading}>
					Cancel
				</Button>
				<Button
					disabled={loading}
					onClick={async () => {
						setLoading(true);
						await callback();
						setLoading(false);
						handleClose();
					}}
					color="secondary"
					autoFocus
				>
					{action}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
