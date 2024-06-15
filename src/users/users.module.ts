import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [UsersService, PrismaService],
  exports: [UsersService], // Exporta el servicio para que otros módulos puedan usarlo.
})
export class UsersModule {}
