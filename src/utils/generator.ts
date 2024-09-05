// import { Uuid } from '../adapters';
// import { IRoom } from '../domain/interfaces';

export const getRandomBoolean = (): boolean => Math.random() < 0.5;

export const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const generateRandomDate = (): string => {
  const start = new Date(1950, 0, 1);
  const end = new Date();
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

export const generateRandomDateBetween = (
  startDate: string,
  endDate: string
): string => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (isNaN(start) || isNaN(end)) {
    throw new Error('Invalid date format. Please use YYYY-MM-DD.');
  }

  if (start > end) {
    throw new Error('Start date must be before end date.');
  }

  const randomDate = new Date(start + Math.random() * (end - start));
  return randomDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

export const generateRandomName = (): string => {
  const names = [
    'John Doe',
    'Jane Smith',
    'Alice Johnson',
    'Bob Brown',
    'Emily White',
  ];
  return names[Math.floor(Math.random() * names.length)];
};

export const generateRandomPhone = (): string => {
  return '+1' + Math.floor(1000000000 + Math.random() * 9000000000); // Random US-style phone number
};

export const generateRandomUsername = (): string => {
  const usernames = ['johndoe', 'janesmith', 'alicej', 'bobb', 'emilyw'];
  return usernames[Math.floor(Math.random() * usernames.length)];
};

export const generateRandomPassword = (): string => {
  return Math.random().toString(36).slice(-8);
};

// export const generateRooms = (count: number): IRoom[] => {
//   const rooms: IRoom[] = [];

//   for (let i = 0; i < count; i++) {
//     rooms.push({
//       id: Uuid.v4(),
//       roomType: getRandomBoolean() ? 'suit' : 'normal',
//       roomNumber: 100 + i,
//       betsNumber: getRandomNumber(1, 3),
//       isAvailable: getRandomBoolean(),
//     });
//   }

//   return rooms;
// };
