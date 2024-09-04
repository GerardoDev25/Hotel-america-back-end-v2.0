import { IUser } from '../interfaces';

describe('user.entity.ts', () => {
  const validUser: IUser = {
    id: 'some user',
    role: 'admin',
    birdDate: '',
    name: '',
    phone: '',
    username: '',
    password: '',
    isActive: false,
  };
});
