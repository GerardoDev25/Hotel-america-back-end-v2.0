import { RoomParams } from '../../domain/interfaces';

export const rooms: RoomParams[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    roomType: 'suit',
    roomNumber: 101,
    betsNumber: 2,
    isAvailable: true,
  },
  {
    id: 'b6745a47-5f95-48d8-9d12-dc5d63bb7695',
    roomType: 'normal',
    roomNumber: 102,
    betsNumber: 1,
    isAvailable: false,
  },
  {
    id: '9e107d9d-372e-4c3f-b0d4-26a0e9083b67',
    roomType: 'suit',
    roomNumber: 103,
    betsNumber: 3,
    isAvailable: true,
  },
  {
    id: '4a7b1e34-b37a-4b7a-b1d5-1f315f8f7a4e',
    roomType: 'normal',
    roomNumber: 104,
    betsNumber: 2,
    isAvailable: false,
  },
];
