import { FrontendRedirectException } from './frontend-redirect.exception';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch(FrontendRedirectException)
export class FrontendRedirectFilter implements ExceptionFilter {
	constructor(private configService: ConfigService) {}

	catch(exception: FrontendRedirectException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		response.redirect(this.configService.get('FRONTEND_URL') + exception.path);
	}
}
