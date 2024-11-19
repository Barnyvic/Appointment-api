export type ProvidusCreateVAType = {
  account_name: string;
  bvn: string;
};

export type ProvidusUpdateAccountType = {
  account_name: string;
  account_number: string;
  bvn: string;
};

export type ProvidusBlackListAccountType = {
  account_number: string;
  blacklist_flg: 1;
};

export type ProvidusWhiteListAccountType = {
  account_number: string;
  blacklist_flg: 0;
};

export type ProvidusCreateVAReturnType = {
  account_number: string;
  account_name: string;
  bvn: string;
};

export type ProvidusCreateDAReturnType = {
  account_number: string;
  account_name: string;
  initiationTranRef: string;
};

export type ProvidusVerifyTransReturnType = {
  sessionId: string;
  initiationTranRef: string;
  accountNumber: string;
  tranRemarks: string;
  transactionAmount: number;
  settledAmount: number;
  feeAmount: number;
  vatAmount: number;
  currency: 'NGN';
  settlementId: string;
  sourceAccountNumber: string;
  sourceAccountName: string;
  sourceBankName: string;
  channelId: string;
  tranDateTime: string;
};
