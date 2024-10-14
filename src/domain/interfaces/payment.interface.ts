export interface IPayment {
  id: string;
  amount: number;
  description?: string;
  paidAt: string;
  type: PaymentType;
  registerId: string;
}

export type PaymentType = 'cash' | 'credit_cart' | 'qr' | 'back';

export enum PaymentTypeList {
  CASH = 'cash',
  CREDIT_CART = 'credit_cart',
  QR = 'qr',
  BACK = 'back',
}

export interface PaymentPagination {
  payments: IPayment[];
  total: number;
  page: number;
  limit: number;
  prev: string | null;
  next: string | null;
}

export type PaymentFilter = Partial<Omit<IPayment, 'id'>>;
export type CreatePayment = Omit<IPayment, 'id' | 'paidAt'>;
export type UpdatePayment = Partial<Omit<CreatePayment, 'registerId'>> & {
  id: string;
};
