import { Generator } from '../../../utils/generator';
import { CreateUserDto } from './create-user.dto';

describe('create-user.dto.ts', () => {
  test('should create an instance of CreateUserDto', () => {
    const data = {
      birdDate: Generator.randomDate(),
      name: Generator.randomName(),
      password: Generator.randomPassword(),
      phone: Generator.randomPhone(),
      role: 'admin',
      username: Generator.randomUsername(),
      isActive: true,
    };

    const [errors, result] = CreateUserDto.create(data);

    expect(errors).toBeUndefined();
    expect(result).toBeInstanceOf(CreateUserDto);
    expect(result).toEqual(
      expect.objectContaining({ ...data, birdDate: new Date(data.birdDate) })
    );
  });
});
