import { UrlObject } from 'url';

export interface SubpageTab {
	text: string;
	path: UrlObject;
}

export type SubpageTabs = SubpageTab[];
