import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(
    username: string,
    email: string,
    password: string,
    nombre?: string,
    apellido?: string,
    telefono?: string,
    direccion?: string,
    referencias?: string,
    tipo?: string
  ): Promise<void> {
    try {
      // Registrar el nuevo usuario
      await this.usersService.register(username, email, password, nombre, apellido, telefono, direccion, referencias, tipo);
    } catch (error) {
      console.error('Error registering user:', error);
      throw new Error('Error registering user');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.validateUser(email, password);
      if (user) {
        // Omitir la propiedad 'password' por razones de seguridad
        const { password: _, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error validating user:', error);
      throw new Error('Failed to validate user');
    }
  }

  async login(user: any): Promise<string> {
    // Crear el payload para el JWT
    const payload = { email: user.email, sub: user.id };

    // Generar el token JWT
    const token = this.jwtService.sign(payload);
    console.log(`Generated Token: ${token}`);
    return token;
  }
}
