import bcrypt from 'bcrypt';
import { IUser, UserRolesList } from '../../domain/interfaces';
import { generateRandomDateBetween } from '../../utils/generator';

export interface IUserSeed extends Omit<IUser, 'id' | 'birdDate'> {
  birdDate: Date;
}

export const users: IUserSeed[] = [
  {
    role: UserRolesList.ADMIN,
    birdDate: new Date(generateRandomDateBetween('1970-01-01', '2000-01-01')),
    name: 'John Doe',
    phone: '+1234567890',
    username: 'John_Doe@username',
    password: bcrypt.hashSync('123456', 10),
    isActive: true,
  },
  {
    role: UserRolesList.LAUNDRY,
    birdDate: new Date(generateRandomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Jane Smith',
    phone: '+0987654321',
    username: 'Jane_Smith@username',
    password: bcrypt.hashSync('123456', 10),
    isActive: true,
  },
  {
    role: UserRolesList.RECEPTION,
    birdDate: new Date(generateRandomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Alice Johnson',
    phone: '+1122334455',
    username: 'Alice_Johnson@username',
    password: bcrypt.hashSync('123456', 10),
    isActive: true,
  },
  {
    role: UserRolesList.CAFE,
    birdDate: new Date(generateRandomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Bob Brown',
    phone: '+5566778899',
    username: 'Bob_Brown@username',
    password: bcrypt.hashSync('123456', 10),
    isActive: true,
  },
  {
    role: 'cafe',
    birdDate: new Date(generateRandomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Emily White',
    phone: '+9988776655',
    username: 'Emily_White@username',
    password: bcrypt.hashSync('123456', 10),
    isActive: false,
  },

  {
    role: UserRolesList.LAUNDRY,
    birdDate: new Date(generateRandomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Maria Smith',
    phone: '+098765434',
    username: 'Maria_Smith@username',
    password: bcrypt.hashSync('123456', 10),
    isActive: false,
  },
];
