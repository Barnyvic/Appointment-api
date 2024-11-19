import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ProvidusCreateVAReturnType,
  ProvidusCreateVAType,
  ProvidusBlackListAccountType,
  ProvidusWhiteListAccountType,
  ProvidusCreateDAReturnType,
  ProvidusUpdateAccountType,
  ProvidusVerifyTransReturnType,
} from './interface';

@Injectable()
export default class ProvidusService {
  private readonly logger = new Logger(ProvidusService.name);

  private request = axios.create({
    baseURL: 'http://154.113.16.142:8088/appdevapi/api/',
    headers: {
      'X-Auth-Signature': `${this.config.get('PROVIDUS_AUTH_SIGNATURE')}`,
      'Client-Id': `${this.config.get('PROVIDUS_CLIENT_ID')}`,
    },
  });

  constructor(private readonly config: ConfigService) {}

  async updateAccountName(payload: ProvidusUpdateAccountType) {
    const { data }: any = await this.request.post('PiPUpdateAccountName', payload);

    if (!data.requestSuccessful) {
      throw new Error(data.responseMessage);
    }

    return payload;
  }

  async reserveVirtualAccount(payload: ProvidusCreateVAType): Promise<ProvidusCreateVAReturnType> {
    const { data }: any = await this.request.post('PiPCreateReservedAccountNumber', payload);

    if (!data.requestSuccessful) {
      throw new Error(data.responseMessage);
    }

    return {
      account_number: data.account_number,
      account_name: data.account_name,
      bvn: data.bvn,
    };
  }

  async createDynamicAccount(payload: {
    account_name: string;
  }): Promise<ProvidusCreateDAReturnType> {
    const { data }: any = await this.request.post('PiPCreateDynamicAccountNumber', payload);

    if (!data.requestSuccessful) {
      throw new Error(data.responseMessage);
    }

    return {
      account_number: data.account_number,
      account_name: data.account_name,
      initiationTranRef: data.initiationTranRef,
    };
  }

  async blacklistVirtualAccount(payload: ProvidusBlackListAccountType) {
    const { data }: any = await this.request.post('PiPBlacklistAccount', payload);

    if (!data.requestSuccessful) {
      throw new Error(data.responseMessage);
    }

    return data;
  }

  async whitelistVirtualAccount(payload: ProvidusWhiteListAccountType) {
    const { data }: any = await this.request.post('PiPBlacklistAccount', payload);

    if (!data.requestSuccessful) {
      throw new Error(data.responseMessage);
    }

    return data;
  }

  async verifyTransactionBySessionID(sessionId: string) {
    const getResponse = await this.request.get('PiPverifyTransaction_sessionid', {
      params: { session_id: sessionId },
    });

    const { data }: any = getResponse;
    if (getResponse.status !== 200) {
      throw new Error(data.tranRemarks);
    }

    return { ...data };
  }

  async verifyTransactionBySettlementId(
    settlementId: string
  ): Promise<ProvidusVerifyTransReturnType> {
    const getResponse = await this.request.get('PiPverifyTransaction_settlementid', {
      params: { settlement_id: settlementId },
    });

    const { data }: any = getResponse;
    if (getResponse.status !== 200) {
      throw new Error(data.tranRemarks);
    }

    return data;
  }

  async providusNotificationWebhook(body: ProvidusVerifyTransReturnType, authSignature: string) {
    const responsePayload = {
      requestSuccessful: true,
      sessionId: body.sessionId,
      responseMessage: 'success',
      responseCode: '00',
    };

    if (authSignature !== `${this.config.get('PROVIDUS_AUTH_SIGNATURE')}`) {
      this.logger.log('Invalid auth signature');
      responsePayload.responseMessage = 'rejected transaction';
      responsePayload.responseCode = '02';
      return responsePayload;
    }

    if (!body.settlementId || !body.accountNumber) {
      this.logger.log('settlementId or accountNumber not found');

      responsePayload.responseMessage = 'rejected transaction';
      responsePayload.responseCode = '02';
      return responsePayload;
    }

    // verify transactions with settlement id
    const transaction = await this.verifyTransactionBySettlementId(body.settlementId);
    if (body.sessionId !== transaction.sessionId) {
      this.logger.log('sessionId does not match');
      responsePayload.responseMessage = 'rejected transaction';
      responsePayload.responseCode = '02';
      return responsePayload;
    }

    return responsePayload;
  }
}
