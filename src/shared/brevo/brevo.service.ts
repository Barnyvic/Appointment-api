import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestHeaders } from 'axios';

type MailerID = {
  name: string;
  email: string;
};

interface MailData {
  sender: MailerID;
  to: MailerID[];
  bcc?: MailerID[];
  cc?: MailerID[];
  htmlContent: string;
  subject: string;
  replyTo?: MailerID;
  tags?: string[];
}

@Injectable()
export class BrevoService {
  logger = new Logger(BrevoService.name);

  private brevoAPI = 'https://api.brevo.com/v3/smtp/email';

  private headers: AxiosRequestHeaders;

  constructor(config: ConfigService, private readonly httpService: HttpService) {
    this.headers = {
      'API-key': config.get('BREVO_API_KEY'),
    } as unknown as AxiosRequestHeaders;
  }

  async sendTransactionalMail(data: MailData) {
    const req = this.httpService
      .post(this.brevoAPI, data, {
        headers: this.headers,
        timeout: 30000,
      })
      .pipe(map(res => res.data.messageId))
      .pipe(
        catchError(err => {
          throw new ForbiddenException(
            err?.response?.data?.message || err?.message || 'API not available'
          );
        })
      );

    const response = await lastValueFrom(req);

    return response;
  }
}
