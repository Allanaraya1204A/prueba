import { AppService } from './app.service';
import { Controller, Post, Body, OnModuleInit, Get } from '@nestjs/common';
import { ClientGrpc, Client, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { join } from 'path';

interface UsersService {
  getUser(data: { id: number }): Observable<any>;
  getUsers(data: {}): Observable<any>;
}

@Controller()
export class AppController implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: 'localhost:50051',
      package: 'users',
      protoPath: join(__dirname, '../protos/users.proto'),
    },
  })
  private client: ClientGrpc;

  private usersService: UsersService;

  onModuleInit() {
    this.usersService = this.client.getService<UsersService>('UsersService');
  }

  @Post('users')
  async getUsers(@Body() body: any): Promise<any> {
    return this.usersService.getUsers({}).toPromise();
  }

  @Post('user')
  async getUser(@Body() body: { id: number }): Promise<any> {
    return this.usersService.getUser({ id: body.id }).toPromise();
  }
}