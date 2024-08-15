import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(
    username: string,
    email: string,
    password: string,
    nombre?: string,
    apellido?: string,
    telefono?: string,
    direccion?: string,
    referencias?: string,
    tipo?: string,
  ): Promise<User> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Creamos el usuario en la base de datos utilizando Prisma ORM
      const newUser = await this.prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          nombre,
          apellido,
          telefono,
          direccion,
          referencias,
          tipo,
        },
      });

      // Devolvemos el usuario con la contraseña codificada
      return newUser;
    } catch (error) {
      throw new Error(`Fallo al registrar usuario: ${error.message}`);
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        console.log(`User con email ${email} no encontrado.`);
        return null;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        console.log(`Contraseña incorrecta para el usuario ${email}`);
        return null;
      }

      console.log(`User con email ${email} validado exitoso.`);
      return user;
    } catch (error) {
      console.error('Error al validar user:', error);
      throw new Error('fallo al validar user');
    }
  }
}
