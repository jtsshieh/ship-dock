import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export const UseJwtAuth = () => UseGuards(JwtAuthGuard);
