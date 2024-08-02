import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { EmailService } from './email.service';

import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService,EmailService],
  exports: [AuthService,EmailService],
  controllers: [AuthController],
})
export class AuthModule {}
