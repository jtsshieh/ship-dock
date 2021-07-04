import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
	BadRequestException,
	ValidationError,
	ValidationPipe,
} from '@nestjs/common';

async function boostrap() {
	const app = await NestFactory.create(AppModule, { cors: true });
	app.use(helmet());
	app.use(cookieParser());
	app.useGlobalPipes(
		new ValidationPipe({
			exceptionFactory(errors: ValidationError[]) {
				const validationErrors: Record<string, string> = {};
				for (const error of errors) {
					if (!error.constraints) continue;
					validationErrors[error.property] = Object.values(
						error.constraints
					)[0];
				}
				return new BadRequestException({ validationErrors });
			},
		})
	);

	const config = new DocumentBuilder()
		.setTitle('ShipDock API')
		.setDescription(
			"ShipDock's backend API to communicate between the frontend and docker"
		)
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	const port = process.env.PORT || 3333;
	await app.listen(port);
}

boostrap();
