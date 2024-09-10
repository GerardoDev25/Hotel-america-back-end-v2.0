export interface IRegister {
  id: string;
  checkIn: string;
  checkOut?: string;
  guestsNumber: number;
  discount: number;
  price: number;
  userId: string;
  roomId: string;
}


export interface RegisterPagination {
  registers: IRegister[];
  total: number;
  page: number;
  limit: number;
  prev: string | null;
  next: string | null;
}
