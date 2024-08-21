import { Injectable, Inject, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RegisterRequest, RegisterResponse } from './register.interfase';

interface AuthServiceClient {
  register(data: RegisterRequest): Observable<RegisterResponse>;
}

@Injectable()
export class AuthService {
  private authServiceClient: AuthServiceClient;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject('AUTH_PACKAGE') private readonly client: ClientGrpc
  ) {
    this.authServiceClient = this.client.getService<AuthServiceClient>('AuthService');
  }

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
      // Registrar el nuevo usuario y obtener el usuario creado con la contraseña codificada
      const newUser = await this.usersService.register(username, email, password, nombre, apellido, telefono, direccion, referencias, tipo);

      // Crear el evento para el registro con la contraseña ya codificada
      const eventData: RegisterRequest = {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password, // Contraseña ya codificada
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        telefono: newUser.telefono,
        direccion: newUser.direccion,
        referencias: newUser.referencias,
        tipo: newUser.tipo
      };

      // Emitir el evento al cliente gRPC
      this.authServiceClient.register(eventData).subscribe(
        response => this.logger.log('Event processed successfully:', response),
        error => this.logger.error('Error processing event:', error)
      );
    } catch (error) {
      this.logger.error('Error registering user:', error);
      throw new Error('Error registering user');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.validateUser(email, password);
      if (user) {
        const { password: _, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      this.logger.error('Error validating user:', error);
      throw new Error('Failed to validate user');
    }
  }

  

  async login(user: any): Promise<{ accesstoken: string; id: number }> {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    this.logger.log(`Generated Token: ${token}`);
    return { accesstoken: token, id: user.id };
  }
  

  
}
