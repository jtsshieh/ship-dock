import { Permission } from '@prisma/client';

export interface JwtPayloadInterface {
	name: string;
	username: string;
	sub: string;
	email: string;
	permissions: Permission[];
}
