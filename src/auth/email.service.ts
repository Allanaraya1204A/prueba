import { Injectable } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { fromIni } from '@aws-sdk/credential-provider-ini';

@Injectable()
export class EmailService {
  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({ region: 'us-east-1', credentials: fromIni() });
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Text: {
            Data: `Tu código de verificación es: ${code}`,
          },
        },
        Subject: {
          Data: 'Código de verificación',
        },
      },
      Source: 'foodrunnercr@gmail.com', // Cambia al remitente verificado en SES
    };

    try {
      const command = new SendEmailCommand(params);
      await this.sesClient.send(command);
      console.log('Correo electrónico enviado exitosamente.');
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      throw new Error('Error al enviar el correo electrónico');
    }
  }
}
