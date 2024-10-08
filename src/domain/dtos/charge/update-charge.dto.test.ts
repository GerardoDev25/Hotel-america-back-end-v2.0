import { Uuid } from '@src/adapters';
import { UpdateChargeDto } from './update-charge.dto';

describe('update-charge.dto.ts', () => {
  it('should create and instance of UpdateChargeDto', () => {
    const data: UpdateChargeDto = {
      id: Uuid.v4(),
      amount: 12,
      description: 'test',
      type: 'other',
    };
    const [errors, chargeDto] = UpdateChargeDto.create(data);
    expect(errors).toBeUndefined();
    expect(chargeDto).toBeInstanceOf(UpdateChargeDto);
  });

  it('should get error if properties are wrong', () => {
    const data = {
      id: Uuid.v4(),
      amount: -12,
      description: 12,
      type: true,
    };

    const [err, chargeDto] = UpdateChargeDto.create(data);
    expect(chargeDto).toBeUndefined();
    expect(err).toEqual([
      'type property most be a string',
      'amount property most be a positive',
      'description property most be a string',
    ]);
  });

  it('should get error if properties are wrong', () => {
    const [err] = UpdateChargeDto.create({} as any);
    expect(err).toBeDefined();
  });
});
