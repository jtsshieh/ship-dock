import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
	(prop: keyof Express.User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<Request>();
		const user = request.user;

		return prop ? user?.[prop] : user;
	}
);
