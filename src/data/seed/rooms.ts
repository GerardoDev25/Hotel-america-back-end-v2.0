import { RoomParams } from '../../domain/interfaces';

export const rooms: Omit<RoomParams, 'id'>[] = [
  {
    roomType: 'normal',
    roomNumber: 100,
    betsNumber: 2,
    isAvailable: true,
  },
  {
    roomType: 'suit',
    roomNumber: 101,
    betsNumber: 2,
    isAvailable: false,
  },
  {
    roomType: 'normal',
    roomNumber: 102,
    betsNumber: 2,
    isAvailable: false,
  },
  {
    roomType: 'normal',
    roomNumber: 103,
    betsNumber: 2,
    isAvailable: true,
  },
  {
    roomType: 'suit',
    roomNumber: 104,
    betsNumber: 1,
    isAvailable: true,
  },
  {
    roomType: 'normal',
    roomNumber: 105,
    betsNumber: 1,
    isAvailable: false,
  },
  {
    roomType: 'normal',
    roomNumber: 106,
    betsNumber: 3,
    isAvailable: false,
  },
  {
    roomType: 'suit',
    roomNumber: 107,
    betsNumber: 2,
    isAvailable: true,
  },
  {
    roomType: 'suit',
    roomNumber: 108,
    betsNumber: 1,
    isAvailable: true,
  },
  {
    roomType: 'suit',
    roomNumber: 109,
    betsNumber: 1,
    isAvailable: false,
  },
  {
    roomType: 'suit',
    roomNumber: 110,
    betsNumber: 3,
    isAvailable: false,
  },
  {
    roomType: 'normal',
    roomNumber: 111,
    betsNumber: 2,
    isAvailable: true,
  },
  {
    roomType: 'normal',
    roomNumber: 112,
    betsNumber: 3,
    isAvailable: true,
  },
  {
    roomType: 'normal',
    roomNumber: 113,
    betsNumber: 2,
    isAvailable: true,
  },
  {
    roomType: 'normal',
    roomNumber: 114,
    betsNumber: 2,
    isAvailable: false,
  },
  {
    roomType: 'normal',
    roomNumber: 115,
    betsNumber: 3,
    isAvailable: false,
  },
  {
    roomType: 'normal',
    roomNumber: 116,
    betsNumber: 2,
    isAvailable: true,
  },
  {
    roomType: 'suit',
    roomNumber: 117,
    betsNumber: 2,
    isAvailable: false,
  },
  {
    roomType: 'normal',
    roomNumber: 118,
    betsNumber: 2,
    isAvailable: true,
  },
  {
    roomType: 'suit',
    roomNumber: 119,
    betsNumber: 2,
    isAvailable: true,
  },
  {
    roomType: 'suit',
    roomNumber: 120,
    betsNumber: 3,
    isAvailable: false,
  },
  {
    roomType: 'normal',
    roomNumber: 121,
    betsNumber: 2,
    isAvailable: true,
  },
  {
    roomType: 'suit',
    roomNumber: 122,
    betsNumber: 3,
    isAvailable: false,
  },
  {
    roomType: 'normal',
    roomNumber: 123,
    betsNumber: 3,
    isAvailable: false,
  },
  {
    roomType: 'normal',
    roomNumber: 124,
    betsNumber: 2,
    isAvailable: true,
  },
  {
    roomType: 'suit',
    roomNumber: 125,
    betsNumber: 2,
    isAvailable: false,
  },
  {
    roomType: 'normal',
    roomNumber: 126,
    betsNumber: 2,
    isAvailable: true,
  },
  {
    roomType: 'normal',
    roomNumber: 127,
    betsNumber: 1,
    isAvailable: false,
  },
  {
    roomType: 'normal',
    roomNumber: 128,
    betsNumber: 2,
    isAvailable: true,
  },
  {
    roomType: 'normal',
    roomNumber: 129,
    betsNumber: 3,
    isAvailable: true,
  },
];

// * room Generator

// export interface RoomParams {
//   id: string;
//   roomType: RoomType;
//   roomNumber: number;
//   betsNumber: number;
//   isAvailable: boolean;
// }

// export type RoomType = 'suit' | 'normal';

// // Function to generate random boolean
// const getRandomBoolean = (): boolean => Math.random() < 0.5;

// // Function to generate a random number between min and max (inclusive)
// const getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

// // Function to generate an array of RoomParams
// const generateRooms = (count: number): RoomParams[] => {
//   const rooms: RoomParams[] = [];

//   for (let i = 0; i < count; i++) {
//     rooms.push({
//       id: `room-${100 + i}`,  // or use uuid for unique ids
//       roomType: getRandomBoolean() ? 'suit' : 'normal',
//       roomNumber: 100 + i,  // Sequential starting from 100
//       betsNumber: getRandomNumber(1, 3),  // Random number between 1 and 3
//       isAvailable: getRandomBoolean(),  // Random true or false
//     });
//   }

//   return rooms;
// };

// // Generate 30 rooms
// const roomsArray = generateRooms(50);

// console.log(roomsArray);
