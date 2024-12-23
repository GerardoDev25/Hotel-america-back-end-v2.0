export interface ICafeteria {
  id: string;
  createdAt: string;
  guestId: string;
  isServed: boolean;
}

export interface CafeteriaItem {
  id: string;
  createdAt: string;
  guestId: string;
  guestName: string;
  roomNumber: number;
  isServed: boolean;
}

export type CafeteriaList = {
  ok: boolean;
  items: CafeteriaItem[];
};

export type UpdateCafeteria = Omit<ICafeteria, 'createdAt' | 'guestId'>;
