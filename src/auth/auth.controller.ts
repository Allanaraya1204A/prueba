// auth.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  async login(data: any): Promise<{ accesstoken: string }> {
    const { email, password } = data;
    console.log(`Attempting login with email: ${email}, password: ${password}`);

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new RpcException('Invalid credentials');
    }

    const token = await this.authService.login(user);
    return { accesstoken: token }; 
  }

  @GrpcMethod('AuthService', 'Register')
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const { username, email, password } = data;

    try {
      await this.authService.register(username, email, password);
      return { message: 'User registered successfully, check your email for the verification code' };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
