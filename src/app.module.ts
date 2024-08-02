import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Configura ConfigModule globalmente
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [PrismaService,{
    provide: APP_PIPE,
    useClass: ValidationPipe,
  }],
})
export class AppModule {}
