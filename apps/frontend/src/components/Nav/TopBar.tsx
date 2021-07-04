import {
	AppBar,
	ClickAwayListener,
	IconButton,
	Portal,
	Theme,
	Toolbar,
	Tooltip,
	Typography,
	useMediaQuery,
	useScrollTrigger,
} from '@material-ui/core';
import { AccountCircle, Brightness3, Menu, WbSunny } from '@material-ui/icons';
import React, { useContext, useEffect, useState } from 'react';
import { ThemeSwitcherContext } from '../Theme/ThemeSwitcherContext';
import { SubpageTabsContext } from './SubpageTabs/SubpageTabsContext';
import { SubpageNavbar } from './SubpageTabs/SubpageNavbar';
import AccountCard from '../AccountCard';
import Image from 'next/image';
import { ProgressBar } from '../Loading/ProgressBar';
import { useUser } from '../../hooks/useUser';
import { api } from '../../util/api';

interface TopBarProps {
	toggleDrawer: () => void;
}

export function TopBar({ toggleDrawer }: TopBarProps) {
	const [accountCard, setAccountCard] = useState(false);
	const { darkTheme, setDarkTheme } = useContext(ThemeSwitcherContext);
	const { subpageTabs } = useContext(SubpageTabsContext);

	const mobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
	const trigger = useScrollTrigger();
	const data = useUser();

	const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (data?.user?.id)
			setAvatarUrl(api.url(`users/${data?.user?.id}/avatar`, true));
	}, [data?.user?.id]);

	return (
		<AppBar
			position="fixed"
			css={(theme) => ({
				backgroundColor: theme.palette.background.default,
				zIndex: theme.zIndex.drawer + 1,
				borderTop: 'none',
				borderRight: 'none',
				borderLeft: 'none',
			})}
			color="inherit"
			variant={trigger ? 'elevation' : 'outlined'}
		>
			<Toolbar css={{ flex: 1 }}>
				<div
					css={(theme) => ({
						flex: 1,
						display: 'flex',
						alignItems: 'center',
						gap: theme.spacing(2),
					})}
				>
					<Tooltip title="Open Drawer">
						<IconButton
							aria-label="Open Drawer"
							edge="start"
							onClick={toggleDrawer}
						>
							<Menu />
						</IconButton>
					</Tooltip>
					<Image alt="logo" src="/logo.png" height={48} width={48} />
					<Typography variant="h6" noWrap>
						Ship Dock
					</Typography>
				</div>
				{!mobile && subpageTabs && (
					<div css={{ flex: 1 }}>
						<SubpageNavbar subpageTabs={subpageTabs} />
					</div>
				)}
				<div css={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
					<Tooltip title="Toggle Dark/Light Theme">
						<IconButton
							onClick={() => setDarkTheme(!darkTheme)}
							aria-label="Toggle Dark/Light Theme"
						>
							{darkTheme ? <WbSunny /> : <Brightness3 />}
						</IconButton>
					</Tooltip>
					<ClickAwayListener onClickAway={() => setAccountCard(false)}>
						<div>
							<Tooltip title="Account">
								<IconButton onClick={() => setAccountCard(!accountCard)}>
									{avatarUrl ? (
										<Image
											src={avatarUrl}
											width={24}
											height={24}
											css={{ borderRadius: '50%' }}
											onError={() => setAvatarUrl(undefined)}
										/>
									) : (
										<AccountCircle />
									)}
								</IconButton>
							</Tooltip>
							<Portal>
								<AccountCard
									open={accountCard}
									css={(theme) => ({ zIndex: theme.zIndex.drawer + 2 })}
								/>
							</Portal>
						</div>
					</ClickAwayListener>
				</div>
			</Toolbar>
			{mobile && subpageTabs && <SubpageNavbar subpageTabs={subpageTabs} />}
			<ProgressBar />
		</AppBar>
	);
}
