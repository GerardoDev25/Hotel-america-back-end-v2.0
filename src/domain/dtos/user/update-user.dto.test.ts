import { Uuid } from '../../../adapters';
import {
  generateRandomDate,
  generateRandomName,
  generateRandomPassword,
  generateRandomPhone,
} from '../../../utils/generator';
import { UpdateUserDto } from './update-user.dto';

describe('update-user.dto.ts', () => {
  test('should create an instance of UpdateUserDto', () => {
    const data = {
      id: Uuid.v4(),
      birdDate: generateRandomDate(),
      name: generateRandomName(),
      password: generateRandomPassword(),
      phone: generateRandomPhone(),
      role: 'admin',
      username: generateRandomName(),
      isActive: true,
    };

    const result = UpdateUserDto.create(data);

    expect(result).toBeInstanceOf(UpdateUserDto);
    expect(result).toEqual(
      expect.objectContaining({ ...data, birdDate: new Date(data.birdDate) })
    );
  });
});
