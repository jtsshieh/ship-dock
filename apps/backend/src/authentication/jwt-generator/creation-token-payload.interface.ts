import { Prisma } from '@prisma/client';

export interface CreationTokenPayload {
	email: string;
	avatar?: string;
	strategyName: string;
	strategyDetails: Prisma.JsonValue;
}
