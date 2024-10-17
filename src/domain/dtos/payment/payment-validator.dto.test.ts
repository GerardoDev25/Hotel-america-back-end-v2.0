import { Uuid } from '@src/adapters';
import {
  PaymentFilter,
  PaymentTypeList,
  UpdatePayment,
} from '@domain/interfaces';
import { PaymentValidator, CreatePaymentDto } from '.';

describe('payment-validator.dto.ts', () => {
  it('should get empty array if pass valid object (create)', () => {
    const data: CreatePaymentDto = {
      amount: 100,
      type: 'cash',
      registerId: Uuid.v4(),
      description: 'test',
    };

    const errors = PaymentValidator.create(data);
    expect(errors.length).toBe(0);
  });

  it('should get description field as optional (create)', () => {
    const data: CreatePaymentDto = {
      amount: 100,
      type: 'credit_cart',
      registerId: Uuid.v4(),
    };

    const errors = PaymentValidator.create(data);
    expect(errors.length).toBe(0);
  });

  it('should get error if pass empty object (create)', () => {
    const data = {} as CreatePaymentDto;

    const errors = PaymentValidator.create(data);

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
    } as unknown as CreatePaymentDto;

    const errors = PaymentValidator.create(data);
    expect(errors).toEqual([
      'type most be: back, cash, credit_cart, qr',
      'amount property most be a positive',
      'registerId is not a valid uuid',
      'description property most be a string',
    ]);
  });

  it('should get empty array if pass a valid object (filter)', () => {
    const data: PaymentFilter = {
      paidAt: new Date().toISOString(),
      registerId: Uuid.v4(),
      amount: 100,
      type: PaymentTypeList.BACK,
      description: 'hello world',
    };

    const errors = PaymentValidator.filter(data);
    expect(errors.length).toBe(0);
  });

  it('should get empty array if pass an empty object (filter)', () => {
    const data = {};

    const errors = PaymentValidator.filter(data);
    expect(errors.length).toBe(0);
  });

  it('should get error if properties are wrong (filter)', () => {
    const data = {
      paidAt: 'new Date().toISOString()',
      registerId: 'Uuid.v4()',
      amount: false,
      type: 'PaymentTypeList.BACK',
      description: 12,
    } as unknown as PaymentFilter;

    const errors = PaymentValidator.filter(data);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'registerId is not a valid uuid',
      'paidAt property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'type most be: back, cash, credit_cart, qr',
      'amount property most be a number',
      'description property most be a string',
    ]);
  });

  it('should get empty array if pass a valid object (update)', () => {
    const data = {
      id: Uuid.v4(),
      amount: 100,
      type: PaymentTypeList.BACK,
      description: 'hello world',
    };

    const errors = PaymentValidator.update(data);
    expect(errors.length).toBe(0);
  });

  it('should get empty array if pass an empty object (update)', () => {
    const data = { id: Uuid.v4() };

    const errors = PaymentValidator.update(data);
    expect(errors.length).toBe(0);
  });

  it('should get error if properties are wrong (update)', () => {
    const data = {
      id: 'Uuid.v4()',
      amount: -100,
      type: false,
      description: 34,
    } as unknown as UpdatePayment;

    const errors = PaymentValidator.update(data);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'id is not a valid uuid',
      'type property most be a string',
      'amount property most be a positive',
      'description property most be a string',
    ]);
  });
});
