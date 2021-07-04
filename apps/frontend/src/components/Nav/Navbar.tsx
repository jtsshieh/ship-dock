import React, { useState } from 'react';
import { TopBar } from './TopBar';
import { DrawerNav } from './Drawer/DrawerNav';

export function Navbar() {
	const [open, setOpen] = useState(false);

	const toggleDrawer = () => {
		setOpen(!open);
	};

	return (
		<>
			<TopBar toggleDrawer={toggleDrawer} />
			<DrawerNav toggleDrawer={toggleDrawer} open={open} />
		</>
	);
}
