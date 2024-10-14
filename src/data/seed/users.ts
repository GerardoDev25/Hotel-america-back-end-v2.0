import { BcryptAdapter } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { IUser, UserRolesList } from '@domain/interfaces';

export interface IUserSeed extends Omit<IUser, 'id' | 'birdDate'> {
  birdDate: Date;
}

export const users: IUserSeed[] = [
  {
    role: UserRolesList.ADMIN,
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'John Doe'.trim().toLowerCase(),
    phone: '+1234567890'.trim(),
    username: 'John_Doe@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('123456'),
    isActive: true,
  },
  {
    role: UserRolesList.LAUNDRY,
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Jane Smith'.trim().toLowerCase(),
    phone: '+0987654321'.trim(),
    username: 'Jane_Smith@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('123456'),
    isActive: true,
  },
  {
    role: UserRolesList.RECEPTION,
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Alice Johnson'.trim().toLowerCase(),
    phone: '+1122334455'.trim(),
    username: 'Alice_Johnson@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('123456'),
    isActive: true,
  },
  {
    role: UserRolesList.CAFE,
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Bob Brown'.trim().toLowerCase(),
    phone: '+5566778899'.trim(),
    username: 'Bob_Brown@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('123456'),
    isActive: true,
  },
  {
    role: 'cafe',
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Emily White'.trim().toLowerCase(),
    phone: '+9988776655'.trim(),
    username: 'Emily_White@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('123456'),
    isActive: false,
  },

  {
    role: UserRolesList.LAUNDRY,
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Maria Smith'.trim().toLowerCase(),
    phone: '+098765434'.trim(),
    username: 'Maria_Smith@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('123456'),
    isActive: false,
  },
];
