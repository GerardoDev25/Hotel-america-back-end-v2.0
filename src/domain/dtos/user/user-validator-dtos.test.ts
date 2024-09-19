import { UserRolesList } from '@domain/interfaces';
import { Generator } from '@src/utils/generator';
import { Uuid } from '@src/adapters';
import { UserValidator } from './user-validator-dtos';

describe('user-validator-dtos.ts', () => {
  test('should get and empty array if pass valid object create()', () => {
    const data = {
      role: UserRolesList.ADMIN,
      birdDate: Generator.randomDate(),
      name: Generator.randomName(),
      phone: Generator.randomPhone(),
      username: Generator.randomUsername(),
      password: Generator.randomPassword(),
      isActive: false,
    };

    const errors = UserValidator.create(data);

    expect(errors.length).toBe(0);
  });

  test('should get and array with errors if pass an invalid object create()', () => {
    const data = {
      role: 'not role',
      birdDate: 'no valid date',
      name: 12,
      phone: null,
      username: true,
      password: true,
      isActive: 34,
    };

    const errors = UserValidator.create(data as any);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'role most be: admin, cafe, laundry, reception',
      'birdDate property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'name property most be a string',
      'phone property most be a string',
      'username property most be a string',
      'password property most be a string',
      'isActive property most be a boolean',
    ]);
  });

  it('should get empty array if pass a valid object update()', () => {
    const data = {
      id: Uuid.v4(),
      role: UserRolesList.ADMIN,
      birdDate: Generator.randomDate(),
      name: Generator.randomName(),
      phone: Generator.randomPhone(),
      username: Generator.randomUsername(),
      password: Generator.randomPassword(),
      isActive: false,
    };

    const errors = UserValidator.update(data);

    expect(errors.length).toBe(0);
  });

  it('should get error if properties are wrong update()', () => {
    const data = {
      id: 'Uuid.v4()',
      role: 'UserRolesList.ADMIN',
      birdDate: false,
      name: 12,
      phone: 12,
      username: 12,
      password: 12,
      isActive: 12,
    };

    const errors = UserValidator.update(data as any);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'id is not a valid uuid',
      'role most be: admin, cafe, laundry, reception',
      'birdDate property type not allow',
      'name property most be a string',
      'phone property most be a string',
      'username property most be a string',
      'password property most be a string',
      'isActive property most be a boolean',
    ]);
  });
});
