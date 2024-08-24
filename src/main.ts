import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  dotenv.config({ path: './.env' });
  const app = await NestFactory.create(AppModule);

  const grpcPort = process.env.GRPC_PORT || '50058'; // Usa el puerto de la variable de entorno o un predeterminado
  const grpcUrl = `localhost:${grpcPort}`;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(__dirname, 'protos/users.proto'),
      url: grpcUrl, // Puerto del servicio gRPC
    },
  });

  await app.startAllMicroservices();
}

bootstrap();