export interface ICharge {
  id: string;
  amount: number;
  description?: string;
  createdAt: string;
  type: ChargeType;
  registerId: string;
}

export type ChargeType = 'lodging' | 'laundry' | 'cafeteria' | 'other';

export enum ChargeTypeList {
  LODGING = 'lodging',
  LAUNDRY = 'laundry',
  CAFETERIA = 'cafeteria',
  OTHER = 'other',
}

export interface ChargePagination {
  charges: ICharge[];
  total: number;
  page: number;
  limit: number;
  prev: string | null;
  next: string | null;
}

export type CreateCharge = Omit<ICharge, 'id' | 'createdAt'>;
export type UpdateCharge = Partial<Omit<CreateCharge, 'registerId'>> & {
  id: string;
};
