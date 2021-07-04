import {
	BadRequestException,
	Controller,
	Get,
	NotFoundException,
	Param,
	Put,
	Res,
	UnauthorizedException,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseJwtAuth } from '../authentication/decorators/use-jwt-auth.decorator';
import { User } from '../authentication/decorators/user.decorator';
import { User as UserModel } from '@prisma/client';

@Controller('api/users')
export class UsersController {
	constructor(private userService: UsersService) {}

	@Get('/:userid/avatar')
	async getAvatar(@Param('userid') userId: string, @Res() res: Response) {
		const data = await this.userService.getAvatar(userId);
		if (!data) throw new NotFoundException();

		const { avatar, contentType } = data;
		res.contentType(contentType);
		res.send(avatar);
	}

	@Put('/:userid/avatar')
	@UseInterceptors(FileInterceptor('avatar'))
	@UseJwtAuth()
	async updateAvatar(
		@Param('userid') userId: string,
		@UploadedFile() avatar: Express.Multer.File,
		@User() user: UserModel
	) {
		if (user.id !== userId) throw new UnauthorizedException();
		if (['image/jpeg', 'image/png'].includes(avatar.mimetype))
			throw new BadRequestException('image is not jpeg/png');
		await this.userService.setAvatar(userId, avatar.buffer, avatar.mimetype);
	}
}
