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
