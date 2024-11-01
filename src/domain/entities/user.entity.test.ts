import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { IUser } from '@domain/interfaces';
import { UserEntity } from './user.entity';

describe('user.entity.ts', () => {
  const validUser: IUser = {
    id: Uuid.v4(),
    role: 'admin',
    birdDate: Generator.randomDate(),
    name: Generator.randomName(),
    phone: Generator.randomPhone(),
    username: Generator.randomUsername(),
    password: Generator.randomPassword(),
    isActive: Generator.randomBoolean(),
  };

  test('should return a UserEntity with valid object', () => {
    const result = UserEntity.fromObject(validUser);
    expect(result).toBeInstanceOf(UserEntity);
  });

  test('should throw error if invalid properties', () => {
    const idInvalid = 'not-id-valid';
    const roleInvalid = 'no-valid-role';
    const birdDateInvalid = 'invalid';
    const nameInvalid = 12;
    const phoneInvalid = false;
    const usernameInvalid = true;
    const passwordInvalid = null;
    const isActiveInvalid = '';

    expect(() =>
      UserEntity.fromObject({ ...validUser, id: idInvalid })
    ).toThrow();
    expect(() =>
      UserEntity.fromObject({ ...validUser, role: roleInvalid })
    ).toThrow();
    expect(() =>
      UserEntity.fromObject({ ...validUser, birdDate: birdDateInvalid })
    ).toThrow();
    expect(() =>
      UserEntity.fromObject({ ...validUser, name: nameInvalid })
    ).toThrow();
    expect(() =>
      UserEntity.fromObject({ ...validUser, phone: phoneInvalid })
    ).toThrow();
    expect(() =>
      UserEntity.fromObject({ ...validUser, username: usernameInvalid })
    ).toThrow();
    expect(() =>
      UserEntity.fromObject({ ...validUser, password: passwordInvalid })
    ).toThrow();
    expect(() =>
      UserEntity.fromObject({ ...validUser, isActive: isActiveInvalid })
    ).toThrow();
  });
});
