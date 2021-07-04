export class FetchError extends Error {
	constructor(message: string, public status: number, public error: any) {
		super(message);
	}
}

interface FetchOptions {
	body?: Record<string, unknown>;
	cookies?: string;
}

export const api = {
	baseUrl: process.env.NEXT_PUBLIC_API_URL,

	url(url: string, forceFull?: boolean) {
		return `${
			typeof window === 'undefined' || forceFull ? api.baseUrl : ''
		}/api/${url}`;
	},

	async fetch(method: string, url: string, options?: FetchOptions) {
		const result = await fetch(api.url(url), {
			method,
			body: JSON.stringify(options?.body),
			credentials: 'include',
			headers: {
				cookie: options?.cookies ?? '',
				'content-type': 'application/json',
			},
		});

		if (!result.ok) {
			const error = await result.json();
			throw new FetchError(error.message, result.status, error);
		}

		try {
			return await result.json();
		} catch {
			return {};
		}
	},

	get(url: string, options?: FetchOptions) {
		return api.fetch('GET', url, options);
	},

	post(url: string, body?: Record<string, unknown>) {
		return api.fetch('POST', url, { body });
	},

	delete(url: string) {
		return api.fetch('DELETE', url);
	},
};
