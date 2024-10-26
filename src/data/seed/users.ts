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
    username: 'john_doe@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('john_doe@username'),
    isActive: true,
  },
  {
    role: UserRolesList.LAUNDRY,
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Jane Smith'.trim().toLowerCase(),
    phone: '+0987654321'.trim(),
    username: 'jane_smith@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('jane_smith@username'),
    isActive: true,
  },
  {
    role: UserRolesList.RECEPTION,
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Alice Johnson'.trim().toLowerCase(),
    phone: '+1122334455'.trim(),
    username: 'alice_johnson@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('alice_johnson@username'),
    isActive: true,
  },
  {
    role: UserRolesList.CAFE,
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Bob Brown'.trim().toLowerCase(),
    phone: '+5566778899'.trim(),
    username: 'bob_brown@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('bob_brown@username'),
    isActive: true,
  },
  {
    role: 'cafe',
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Emily White'.trim().toLowerCase(),
    phone: '+9988776655'.trim(),
    username: 'emily_white@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('emily_white@username'),
    isActive: false,
  },

  {
    role: UserRolesList.LAUNDRY,
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Maria Smith'.trim().toLowerCase(),
    phone: '+098765434'.trim(),
    username: 'maria_smith@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('maria_smith@username'),
    isActive: false,
  },
];
