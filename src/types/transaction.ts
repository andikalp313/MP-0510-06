export interface CreateTransactionParams {
  userId: string;

  eventId: string;

  qty: number;

  pointsUsed?: number;

  voucherCode?: string;

  couponCode?: string;

  paymentProof?: string;

  ticketType: "REGULER" | "VIP" | "VVIP";
}

export enum TransactionStatus {
  PENDING = "PENDING",

  COMPLETED = "COMPLETED",

  CANCELED = "CANCELED",
}
