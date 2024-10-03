import { Uuid } from '@src/adapters';
import { IPayment, PaymentTypeList } from '../interfaces';
import { Generator } from '@src/utils/generator';
import { PaymentEntity } from './payment.entity';

describe('payment.entity.ts', () => {
  const paymentValid: IPayment = {
    id: Uuid.v4(),
    amount: 100,
    paidAt: Generator.randomDate(),
    type: PaymentTypeList.BACK,
    registerId: Uuid.v4(),
  };

  test('should get valid payment with valid object', () => {
    const result = PaymentEntity.fromObject(paymentValid);
    expect(result).toBeInstanceOf(PaymentEntity);
  });

  test('should throw error register with invalid properties', () => {
    const invalidId = 'Uuid.v4()';
    const invalidAmount = -12;
    const invalidPaidAt = 'Generator.randomDate()';
    const invalidType = 'PaymentTypeList.BACK';
    const invalidRegisterId = 'Uuid.v4()';

    expect(() =>
      PaymentEntity.fromObject({ ...paymentValid, id: invalidId })
    ).toThrow();

    expect(() =>
      PaymentEntity.fromObject({ ...paymentValid, amount: invalidAmount })
    ).toThrow();

    expect(() =>
      PaymentEntity.fromObject({ ...paymentValid, paidAt: invalidPaidAt })
    ).toThrow();

    expect(() =>
      PaymentEntity.fromObject({ ...paymentValid, type: invalidType })
    ).toThrow();

    expect(() =>
      PaymentEntity.fromObject({
        ...paymentValid,
        registerId: invalidRegisterId,
      })
    ).toThrow();
  });
});
