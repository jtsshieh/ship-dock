import {
	Divider,
	fade,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	SwipeableDrawer,
} from '@material-ui/core';
import { Theme, useTheme } from '@emotion/react';
import Link from 'next/link';
import { css } from '@emotion/css';
import { DRAWER_ITEMS, isDivider, isHeader } from './DrawerItems';
import { createElement } from 'react';
import { useRouter } from 'next/router';

const drawerWidth = 300;

interface DrawerNavProps {
	open: boolean;
	toggleDrawer: () => void;
}

export function DrawerNav({ open, toggleDrawer }: DrawerNavProps) {
	const router = useRouter();
	const theme = useTheme();

	return (
		<SwipeableDrawer
			css={(theme: Theme) => ({
				[theme.breakpoints.up('md')]: {
					width: drawerWidth,
					flexShrink: 0,
				},
			})}
			classes={{ paper: css({ width: drawerWidth }) }}
			variant="temporary"
			ModalProps={{
				keepMounted: true,
			}}
			open={open}
			onOpen={toggleDrawer}
			onClose={toggleDrawer}
		>
			<div css={{ overflow: 'auto', paddingRight: theme.spacing(1) }}>
				<List>
					{DRAWER_ITEMS.map((item, index) =>
						isDivider(item) ? (
							<Divider key={index} />
						) : isHeader(item) ? (
							<ListSubheader key={index}>{item.text}</ListSubheader>
						) : (
							<Link href={item.path} key={index}>
								<ListItem
									selected={
										item.exact
											? router.pathname === item.path
											: router.pathname.startsWith(item.path)
									}
									button
									component="a"
									onClick={toggleDrawer}
									css={{ borderRadius: '0 2rem 2rem 0', height: 56 }}
									classes={{
										selected: css({
											backgroundColor:
												fade(
													theme.palette.primary.main,
													theme.palette.action.selectedOpacity
												) + ' !important',
											'&:hover': {
												backgroundColor:
													fade(
														theme.palette.primary.main,
														theme.palette.action.selectedOpacity +
															theme.palette.action.hoverOpacity
													) + ' !important',
											},
										}),
									}}
								>
									{item.icon && (
										<ListItemIcon>{createElement(item.icon)}</ListItemIcon>
									)}
									<ListItemText primary={item.text} />
								</ListItem>
							</Link>
						)
					)}
				</List>
			</div>
		</SwipeableDrawer>
	);
}
