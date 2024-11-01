import { Uuid } from '@src/adapters';
import { CreatePaymentDto } from './create-payment.dto';

describe('create-payment.dto.ts', () => {
  it('should create and instance of CreatePaymentDto', () => {
    const data = {
      amount: 100,
      type: 'cash',
      registerId: Uuid.v4(),
      description: 'test',
    };

    const [errors, paymentDto] = CreatePaymentDto.create(data);

    expect(errors).toBeUndefined();
    expect(paymentDto).toBeInstanceOf(CreatePaymentDto);
  });

  it('should get error if properties are wrong', () => {
    const data = {
      amount: -100,
      type: 'test',
      registerId: 'Uuid.v4()',
      description: new Date(),
    };

    const [errors, paymentDto] = CreatePaymentDto.create(data);

    expect(paymentDto).toBeUndefined();
    expect(errors).toEqual([
      'type most be: bank, cash, credit_cart, qr',
      'amount property most be a positive',
      'registerId is not a valid uuid',
      'description property most be a string',
    ]);
  });
});
