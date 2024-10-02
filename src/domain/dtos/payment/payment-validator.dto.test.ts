import { Uuid } from '@src/adapters';
import { PaymentValidator, CreatePaymentDto } from './';

describe('payment-validator.dto.ts', () => {
  it('should get empty array if pass valid object', () => {
    const data: CreatePaymentDto = {
      amount: 100,
      type: 'cash',
      registerId: Uuid.v4(),
      description: 'test',
    };

    const errors = PaymentValidator.create(data);
    expect(errors.length).toBe(0);
  });

  it('should get description field as optional', () => {
    const data: CreatePaymentDto = {
      amount: 100,
      type: 'credit_cart',
      registerId: Uuid.v4(),
    };

    const errors = PaymentValidator.create(data);
    expect(errors.length).toBe(0);
  });

  it('should get error if pass empty object', () => {
    const data = {} as CreatePaymentDto;

    const errors = PaymentValidator.create(data);

    expect(errors).toEqual([
      'type property is required',
      'amount property is required',
      'registerId property is required',
    ]);
  });

  it('should get array with errors if pass invalid object', () => {
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
});
