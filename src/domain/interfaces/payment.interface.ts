export interface IPayment {
  id: string;
  amount: number;
  description?: string;
  paidAt: string;
  type: PaymentType;
  registerId: string;
}

export type PaymentType = 'cash' | 'credit_cart' | 'qr' | 'back';

export interface PaymentPagination {
  payments: IPayment[];
  total: number;
  page: number;
  limit: number;
  prev: string | null;
  next: string | null;
}

export type PaymentFilter = Partial<Omit<IPayment, 'id'>>;
export type IPaymentFilterDto = Partial<Omit<PaymentFilter, 'paidAt'>> & {
  paidAt?: Date | { gte: Date; lt: Date };
};

export type CreatePayment = Omit<IPayment, 'id' | 'paidAt'>;
export type UpdatePayment = Partial<Omit<CreatePayment, 'registerId'>> & {
  id: string;
};
