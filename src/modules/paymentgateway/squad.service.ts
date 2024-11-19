import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import axios from 'axios';
import { SquadWebhookBody } from 'src/interfaces/squad.interface';
import * as crypto from 'crypto';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionStatus } from '../transactions/enum/transaction.enum';

export type InitiatePaymentType = {
  amount: number;
  userId: string;
  email: string;
  transactionRef?: string;
  metadata?: Record<string, any>;
  serviceId?: string;
};

@Injectable()
export class SquadService {
  constructor(
    private readonly config: ConfigService,
    private readonly transactionsService: TransactionsService
  ) {}

  private instance = axios.create({
    baseURL: this.config.get('SQUAD_URL'),
    headers: {
      Authorization: `Bearer ${this.config.get('SQUAD_TOKEN')}`,
    },
  });

  async initiatePayment({
    amount,
    serviceId,
    email,
    transactionRef,
    userId,
    metadata,
  }: InitiatePaymentType): Promise<any> {
    const payload = {
      amount: amount * 100,
      email,
      currency: 'NGN',
      initiate_type: 'inline',
      transaction_ref: transactionRef ?? randomUUID(),
      pass_charge: true,
      metadata,
    };

    await this.transactionsService.createTransaction(userId, {
      amount,
      email,
      transactionRef: transactionRef ?? randomUUID(),
      metadata,
      serviceId,
    });

    const response = await this.instance.post('/transaction/initiate', payload);
    const redirectUrl = response.data.data.checkout_url;

    return redirectUrl;
  }

  async handleWebhookNotification(payload: SquadWebhookBody, headers: any): Promise<any> {
    const { transaction_ref: transactionRef } = payload.Body;

    if (payload.Event !== 'charge_successful') {
      await this.transactionsService.updateTransactionStatus(transactionRef, {
        status: TransactionStatus.FAILED,
      });
      return Logger.log('Transaction failed:');
    }

    const hash = crypto
      .createHmac('sha512', this.config.get('SQUAD_TOKEN'))
      .update(JSON.stringify(payload))
      .digest('hex')
      .toUpperCase();

    if (hash !== headers['x-squad-encrypted-body']) {
      return Logger.log('Invalid event', payload.Body);
    }

    const verifyResponse = await this.verifyTransaction(transactionRef);

    await this.transactionsService.updateTransactionStatus(transactionRef, {
      status: TransactionStatus.COMPLETED,
    });

    Logger.log('Transaction successful:', verifyResponse);
  }

  async verifyTransaction(transactionRef: string): Promise<any> {
    const verifyResponse = await this.instance.get(`/transaction/verify/${transactionRef}`);

    return verifyResponse.data;
  }
}
