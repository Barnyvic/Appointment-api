type PaymentInformation = {
  payment_type: string;
  pan: string;
  card_type: string;
};

type MetaData = {
  paymentType: string;
  userId: string;
};

export type SquadWebhookBody = {
  Event: 'charge_successful' | 'charge_failed' | 'charge_pending' | 'charge_reversed';
  TransactionRef: string;
  Body: {
    amount: number;
    transaction_ref: string;
    gateway_ref: string;
    transaction_status: string;
    email: string;
    merchant_id: string;
    currency: string;
    transaction_type: string;
    merchant_amount: number;
    created_at: string;
    meta: MetaData;
    payment_information: PaymentInformation;
    is_recurring: boolean;
  };
};
