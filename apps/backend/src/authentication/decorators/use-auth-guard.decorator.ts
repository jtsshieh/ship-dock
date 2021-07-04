import { UseGuards } from '@nestjs/common';
import { AuthProviderGuard } from '../guards/auth-provider.guard';

export const UseAuthGuard = (
	strategy: string,
	authenticateOptions?: Record<string, string>
) => UseGuards(AuthProviderGuard(strategy, authenticateOptions));
