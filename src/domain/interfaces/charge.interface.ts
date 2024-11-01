export interface ICharge {
  id: string;
  amount: number;
  description?: string;
  createdAt: string;
  type: ChargeType;
  registerId: string;
}

export type ChargeType =
  | 'lodging'
  | 'laundry'
  | 'cafeteria'
  | 'other'
  | 'new_guest';

export interface ChargePagination {
  charges: ICharge[];
  total: number;
  page: number;
  limit: number;
  prev: string | null;
  next: string | null;
}

export type ChargeFilter = Partial<Omit<ICharge, 'id'>>;
export type IChargeFilterDto = Partial<Omit<ChargeFilter, 'createdAt'>> & {
  createdAt?: Date | { gte: Date; lt: Date };
};

export type CreateCharge = Omit<ICharge, 'id' | 'createdAt'>;
export type UpdateCharge = Partial<Omit<CreateCharge, 'registerId'>> & {
  id: string;
};
