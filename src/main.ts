import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  dotenv.config({ path: './.env' });
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(__dirname, 'protos/users.proto'),
      url: 'localhost:50058', // Puerto del servicio gRPC
    },
  });
  await app.startAllMicroservices();
  await app.listen(3007);
}
bootstrap();
