import { Generator } from '@src/utils/generator';
import { FilterUserDto } from './';

describe('filter-user.dto.ts', () => {
  it('should create an instance of FilterUserDto', () => {
    const data = {
      birdDate: Generator.randomDate(),
      name: Generator.randomName(),
      password: Generator.randomPassword(),
      phone: Generator.randomPhone(),
      role: 'admin',
      username: Generator.randomUsername(),
      isActive: true,
    };

    const [errors, result] = FilterUserDto.create(data);

    expect(errors).toBeUndefined();
    expect(result).toBeInstanceOf(FilterUserDto);
    expect(result).toEqual(
      expect.objectContaining({ ...data, birdDate: new Date(data.birdDate) })
    );
  });

  it('should have all the properties as optional', () => {
    const data = {};

    const [errors, result] = FilterUserDto.create(data);

    expect(errors).toBeUndefined();
    expect(result).toBeInstanceOf(FilterUserDto);
    expect(result).toEqual(expect.objectContaining(data));
  });

  it('should get error if properties are wrong', () => {
    const data = {
      birdDate: '',
      isActive: '',
      name: true,
      password: 12,
      phone: new Date(),
      role: 'asasas',
      username: true,
    };
    const [errors, result] = FilterUserDto.create(data);

    expect(result).toBeUndefined();
    expect(errors).toBeInstanceOf(Array);
    expect(errors?.length).toBeGreaterThan(0);
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
});
