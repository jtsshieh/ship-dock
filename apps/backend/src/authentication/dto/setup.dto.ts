import { IsEmail, IsString } from 'class-validator';

export class SetupDto {
	@IsString()
	name!: string;

	@IsEmail()
	email!: string;

	@IsString()
	password!: string;
}
