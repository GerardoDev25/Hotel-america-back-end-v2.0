export interface IPayment {
  id: string;
  amount: number;
  description?: string;
  type: TypePayment;
  registerId: string;
}

export type TypePayment = 'cash' | 'credit_cart' | 'qr' | 'back';

export interface PaymentPagination {
  payments: IPayment[];
  total: number;
  page: number;
  limit: number;
  prev: string | null;
  next: string | null;
}

export type CreatePayment = Omit<IPayment, 'id'>;
export type UpdatePayment = Partial<Omit<CreatePayment, 'registerId'>> & {
  id: string;
};
