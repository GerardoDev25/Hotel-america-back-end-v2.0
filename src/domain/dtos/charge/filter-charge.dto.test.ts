import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { ChargeFilter } from '@domain/interfaces';
import { FilterChargeDto } from '.';

describe('filter-charge.dto.ts', () => {
  it('should create and instance of FilterChargeDto', () => {
    const data: ChargeFilter = {
      registerId: Uuid.v4(),
      createdAt: Generator.randomDate(),
      amount: 12,
      description: 'test',
      type: 'other',
    };
    const [errors, chargeDto] = FilterChargeDto.create(data);
    expect(errors).toBeUndefined();
    expect(chargeDto).toBeInstanceOf(FilterChargeDto);
  });

  it('should pass with and empty object', () => {
    const [err, dto] = FilterChargeDto.create({} as any);
    expect(err).toBeUndefined();
    expect(dto).toBeInstanceOf(FilterChargeDto);
  });

  it('should get error if properties are wrong', () => {
    const data = {
      registerId: 'Uuid.v4()',
      createdAt: 'Generator.randomDate()',
      amount: false,
      description: new Date(),
      type: 23,
    };

    const [err, chargeDto] = FilterChargeDto.create(data);
    expect(chargeDto).toBeUndefined();
    expect(err).toEqual([
      'registerId is not a valid uuid',
      'createdAt property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'type property most be a string',
      'amount property most be a number',
      'description property most be a string',
    ]);
  });
});
