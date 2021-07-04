import {
	fade,
	Tab,
	Tabs,
	Theme,
	Toolbar,
	useMediaQuery,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { SubpageTabs } from './SubpageTabs';
import { css } from '@emotion/css';
import { useTheme } from '@emotion/react';

export function SubpageNavbar({ subpageTabs }: { subpageTabs: SubpageTabs }) {
	const router = useRouter();
	const theme = useTheme();
	const mobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
	const fullWidth = useMediaQuery<Theme>((theme) =>
		theme.breakpoints.down('xs')
	);

	const tabs = (
		<Tabs
			value={router.route}
			centered
			css={{ height: 64, flexGrow: 1 }}
			indicatorColor="primary"
			textColor="primary"
			variant={fullWidth ? 'fullWidth' : 'standard'}
			classes={{
				indicator: css({ height: 4 }),
			}}
		>
			{subpageTabs.map((tab) => (
				<Tab
					disableRipple
					key={tab.text}
					value={tab.path.pathname}
					label={tab.text}
					css={{ height: 64 }}
					onClick={() => router.push(tab.path)}
					classes={{
						root: css({
							'&:hover': {
								backgroundColor: theme.palette.action.hover,
							},
							textTransform: 'none',
						}),
						selected: css({
							'&:hover': {
								backgroundColor: fade(
									theme.palette.primary.main,
									theme.palette.action.selectedOpacity +
										theme.palette.action.hoverOpacity
								),
							},
						}),
					}}
				/>
			))}
		</Tabs>
	);
	return mobile ? <Toolbar>{tabs}</Toolbar> : tabs;
}
