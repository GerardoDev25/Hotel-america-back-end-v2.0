import { Uuid } from '@src/adapters';
import { UpdatePaymentDto } from './update-payment.dto';

describe('update-payment.dto.ts', () => {
  it('should create and instance of UpdatePaymentDto', () => {
    const data: UpdatePaymentDto = {
      id: Uuid.v4(),
      amount: 12,
      description: 'test',
      type: 'credit_cart',
    };
    const [err, paymentDto] = UpdatePaymentDto.create(data);
    expect(err).toBeUndefined();
    expect(paymentDto).toBeInstanceOf(UpdatePaymentDto);
  });

  it('should get error if properties are wrong', () => {
    const data = {
      id: Uuid.v4(),
      amount: -12,
      description: 12,
      type: true,
    };

    const [err, paymentDto] = UpdatePaymentDto.create(data);
    expect(paymentDto).toBeUndefined();
    expect(err).toEqual([
      'type property most be a string',
      'amount property most be a positive',
      'description property most be a string',
    ]);
  });

  it('should get error if properties are wrong', () => {
    const [err] = UpdatePaymentDto.create({} as any);
    expect(err).toBeDefined();
  });
});
