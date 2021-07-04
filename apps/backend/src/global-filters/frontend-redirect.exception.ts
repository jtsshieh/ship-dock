export class FrontendRedirectException extends Error {
	constructor(public path: string) {
		super();
	}
}
