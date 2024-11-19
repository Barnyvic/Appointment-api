import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PhoneNumberHelper } from '../../utils';

export enum TermiiChannels {
  GENERIC = 'generic',
  DND = 'dnd',
  whatsapp = 'whatsapp',
}

export type SendMessageType = {
  userIdentifier: string;
  channel?: TermiiChannels;
  message: string;
};

export type VerifyOTPType = {
  pinId: string;
  pin: string | number;
};

@Injectable()
export class TermiiService {
  private instance = axios.create({
    baseURL: 'https://api.ng.termii.com/api',
    headers: { 'Content-Type': 'application/json' },
  });

  private config: {
    apiKey: string;
    senderId: string;
  } = {
    apiKey: this.configService.get('TERMII_API_KEY'),
    senderId: this.configService.get('TERMII_SENDER_ID'),
  };

  constructor(private configService: ConfigService) {}

  async sendMessage(data: SendMessageType) {
    try {
      const payload = {
        to: PhoneNumberHelper.formatToCountryStandard(data.userIdentifier),
        from: this.config.senderId,
        sms: data.message,
        type: 'plain',
        channel: data.channel ?? TermiiChannels.DND,
        api_key: this.config.apiKey,
      };

      await this.instance.post('/sms/send', payload);
    } catch (error) {
      throw new HttpException(error.response.data.message, error.response.status);
    }
  }
}
