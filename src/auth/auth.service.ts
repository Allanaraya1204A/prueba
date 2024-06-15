import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string): Promise<void> {
    await this.usersService.register(username, email, password);
  }
  
  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.validateUser(email, password);
      if (user) {
        const { password: _, ...result } = user; // Omitir la propiedad 'password' ya que no deberia ir para mejor seguridad ok
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error validating user:', error);
      throw new Error('Failed to validate user');
    }
  }

  async login(user: any): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    console.log(`Generated Token: ${token}`); 
    return token;
  }
}
