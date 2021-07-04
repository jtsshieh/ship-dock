import { Dns, Home, Image, SvgIconComponent } from '@material-ui/icons';

interface DrawerDivider {
	type: 'divider';
}

interface DrawerHeader {
	type: 'header';
	text: string;
}

interface DrawerLink {
	type: 'link';
	text: string;
	path: string;
	icon?: SvgIconComponent;
	exact?: boolean;
}

export type DrawerItem = DrawerDivider | DrawerHeader | DrawerLink;

export function isDivider(item: DrawerItem): item is DrawerDivider {
	return item.type === 'divider';
}

export function isHeader(item: DrawerItem): item is DrawerHeader {
	return item.type === 'header';
}

export function isLink(item: DrawerItem): item is DrawerLink {
	return item.type === 'link';
}

export const DRAWER_ITEMS: DrawerItem[] = [
	{ type: 'link', text: 'Home', path: '/app', icon: Home, exact: true },
	{ type: 'divider' },
	{ type: 'header', text: 'Docker' },
	{ type: 'link', text: 'Images', path: '/app/images', icon: Image },
	{ type: 'link', text: 'Containers', path: '/app/containers', icon: Dns },
];
