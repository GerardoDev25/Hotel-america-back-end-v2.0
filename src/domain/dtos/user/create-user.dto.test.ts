import { Uuid } from '../../../adapters';
import {
  generateRandomDate,
  generateRandomName,
  generateRandomPassword,
  generateRandomPhone,
} from '../../../utils/generator';
import { CreateUserDto } from './create-user.dto';

describe('create-user.dto.ts', () => {
  test('should create an instance of CreateUserDto', () => {
    const data = {
      birdDate: generateRandomDate(),
      name: generateRandomName(),
      password: generateRandomPassword(),
      phone: generateRandomPhone(),
      role: 'admin',
      username: generateRandomName(),
      isActive: true,
    };

    const result = CreateUserDto.create(data);

    expect(result).toBeInstanceOf(CreateUserDto);
    expect(result).toEqual(
      expect.objectContaining({ ...data, birdDate: new Date(data.birdDate) })
    );
  });
});
