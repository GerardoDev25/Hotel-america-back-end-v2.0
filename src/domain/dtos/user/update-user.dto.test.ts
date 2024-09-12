import { Uuid } from '../../../adapters';
import { Generator } from '../../../utils/generator';
import { UpdateUserDto } from './update-user.dto';

describe('update-user.dto.ts', () => {
  test('should create an instance of UpdateUserDto', () => {
    const data = {
      id: Uuid.v4(),
      birdDate: Generator.randomDate(),
      name: Generator.randomName(),
      password: Generator.randomPassword(),
      phone: Generator.randomPhone(),
      role: 'admin',
      username: Generator.randomUsername(),
      isActive: true,
    };

    const [errors, result] = UpdateUserDto.create(data);

    expect(errors).toBeUndefined();
    expect(result).toBeInstanceOf(UpdateUserDto);
    expect(result).toEqual(
      expect.objectContaining({ ...data, birdDate: new Date(data.birdDate) })
    );
  });
});
