export interface ICafeteria {
  id: string;
  checkIn: string;
  guestId: string;
  isServed: boolean;
}

export type UpdateCafeteria = Omit<ICafeteria, 'checkIn' | 'guestId'>;
