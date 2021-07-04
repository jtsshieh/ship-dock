import { mutate } from 'swr';
import { api } from '../util/api';

export function loginLocal(username: string, password: string) {
	return api.post('auth/local', { username, password });
}

export function setup(name: string, email: string, password: string) {
	return api.post('auth/setup', { name, email, password });
}

export async function logout() {
	await api.post('auth/logout');
	await mutate('auth/profile');
}

export async function createAccount(name: string, username: string) {
	return await api.post('auth/create-account', { name, username });
}
