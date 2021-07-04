import {
	ExecutionContext,
	Injectable,
	mixin,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategiesService } from '../strategies/strategies.service';

export function AuthProviderGuard(
	strategy: string,
	authenticateOptions?: Record<string, string>
) {
	@Injectable()
	class AuthProviderGuard extends AuthGuard(strategy) {
		constructor(private strategyService: StrategiesService) {
			super();
		}

		async canActivate(context: ExecutionContext): Promise<boolean> {
			if (!(await this.strategyService.isEnabled(strategy))) {
				throw new UnauthorizedException('This strategy is not enabled');
			}
			return super.canActivate(context) as Promise<boolean>;
		}

		getAuthenticateOptions() {
			return authenticateOptions;
		}
	}

	return mixin(AuthProviderGuard);
}
