// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { EmailService } from './email.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50057', // URL del servicio Auth
          package: 'auth',
          protoPath: join(__dirname, '../protos/users.proto'),
        },
      },
    ]),
  ],
  providers: [AuthService, EmailService],
  exports: [AuthService, EmailService],
  controllers: [AuthController],
})
export class AuthModule {}
