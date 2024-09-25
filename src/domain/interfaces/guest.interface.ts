export interface IGuest {
  id: string;
  di: string;
  checkIn: string;
  checkOut?: string;
  dateOfBirth: string;
  city: string;
  name: string;
  lastName: string;
  phone: string;
  roomNumber: number;
  countryId: string;
  registerId: string;
}
