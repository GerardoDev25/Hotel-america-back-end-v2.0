import { Uuid } from '@src/adapters';
import { ChargeValidator, CreateChargeDto } from '.';
import { ChargeFilter, UpdateCharge } from '@src/domain/interfaces';
import { Generator } from '@src/utils/generator';

describe('charge-validator.dto.ts', () => {
  it('should get empty array if pass valid object (create)', () => {
    const data: CreateChargeDto = {
      amount: 100,
      type: 'cafeteria',
      registerId: Uuid.v4(),
      description: 'test',
    };

    const errors = ChargeValidator.create(data);
    expect(errors.length).toBe(0);
  });

  it('should get description field as optional (create)', () => {
    const data: CreateChargeDto = {
      amount: 100,
      type: 'lodging',
      registerId: Uuid.v4(),
    };

    const errors = ChargeValidator.create(data);
    expect(errors.length).toBe(0);
  });

  it('should get error if pass empty object (create)', () => {
    const data = {} as CreateChargeDto;

    const errors = ChargeValidator.create(data);

    expect(errors).toEqual([
      'type property is required',
      'amount property is required',
      'registerId property is required',
    ]);
  });

  it('should get array with errors if pass invalid object (create)', () => {
    const data = {
      amount: -100,
      type: 'as',
      registerId: 'Uuid.v4()',
      description: true,
    } as unknown as CreateChargeDto;

    const errors = ChargeValidator.create(data);
    expect(errors).toEqual([
      'type most be: cafeteria, laundry, lodging, other, new_guest',
      'amount property most be a positive',
      'registerId is not a valid uuid',
      'description property most be a string',
    ]);
  });

  it('should get empty array if pass a valid object (filter)', () => {
    const data: ChargeFilter = {
      createdAt: Generator.randomDate(),
      registerId: Uuid.v4(),
      amount: 100,
      type: 'cafeteria',
      description: 'hello world',
    };

    const errors = ChargeValidator.filter(data);
    expect(errors.length).toBe(0);
  });

  it('should get empty array if pass an empty object (filter)', () => {
    const data = {};

    const errors = ChargeValidator.filter(data);
    expect(errors.length).toBe(0);
  });

  it('should get error if properties are wrong (filter)', () => {
    const data = {
      createdAt: 'Generator.randomDate()',
      registerId: 'Uuid.v4()',
      amount: -100,
      type: 'no valid',
      description: 12,
    } as unknown as ChargeFilter;

    const errors = ChargeValidator.filter(data);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'registerId is not a valid uuid',
      'createdAt property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'type most be: cafeteria, laundry, lodging, other, new_guest',
      'amount property most be a positive',
      'description property most be a string',
    ]);
  });

  it('should get empty array if pass a valid object (update)', () => {
    const data: UpdateCharge = {
      id: Uuid.v4(),
      amount: 100,
      type: 'cafeteria',
      description: 'hello world',
    };

    const errors = ChargeValidator.update(data);
    expect(errors.length).toBe(0);
  });

  it('should get empty array if pass an empty object (update)', () => {
    const data = { id: Uuid.v4() };

    const errors = ChargeValidator.update(data);
    expect(errors.length).toBe(0);
  });

  it('should get error if properties are wrong (update)', () => {
    const data = {
      id: 'Uuid.v4()',
      amount: -100,
      type: false,
      description: 34,
    } as unknown as UpdateCharge;

    const errors = ChargeValidator.update(data);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'id is not a valid uuid',
      'type property most be a string',
      'amount property most be a positive',
      'description property most be a string',
    ]);
  });
});
