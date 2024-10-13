import { Uuid } from '@src/adapters';
import { CreateChargeDto } from '.';

describe('create-charge.dto.ts', () => {
  it('should create and instance of CreateChargeDto', () => {
    const data = {
      amount: 100,
      type: 'other',
      registerId: Uuid.v4(),
      description: 'test',
    };

    const [errors, chargeDto] = CreateChargeDto.create(data);

    expect(errors).toBeUndefined();
    expect(chargeDto).toBeInstanceOf(CreateChargeDto);
  });

  it('should get error if properties are wrong', () => {
    const data = {
      amount: -100,
      type: 'test',
      registerId: 'Uuid.v4()',
      description: new Date(),
    };

    const [errors, paymentDto] = CreateChargeDto.create(data);

    expect(paymentDto).toBeUndefined();
    expect(errors).toEqual([
      'type most be: cafeteria, laundry, lodging, other, new_guest',
      'amount property most be a positive',
      'registerId is not a valid uuid',
      'description property most be a string',
    ]);
  });
});
