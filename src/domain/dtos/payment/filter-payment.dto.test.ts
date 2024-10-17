import { Uuid } from '@src/adapters';
import { FilterPaymentDto } from '.';
import { PaymentFilter } from '@src/domain/interfaces';
import { Generator } from '@src/utils/generator';

describe('filter-payment.dto.ts', () => {
  it('should create and instance of FilterPaymentDto', () => {
    const data: PaymentFilter = {
      paidAt: Generator.randomDate(),
      registerId: Uuid.v4(),
      amount: 12,
      description: 'test',
      type: 'credit_cart',
    };
    const [err, paymentDto] = FilterPaymentDto.create(data);
    expect(err).toBeUndefined();
    expect(paymentDto).toBeInstanceOf(FilterPaymentDto);
  });

  it('should get error if properties are wrong', () => {
    const data = {
      paidAt: false,
      registerId: 'Uuid.v4()',
      amount: -12,
      description: 12,
      type: true,
    };

    const [err, paymentDto] = FilterPaymentDto.create(data);
    expect(paymentDto).toBeUndefined();
    expect(err).toEqual([
      'registerId is not a valid uuid',
      'paidAt property type not allow',
      'type property most be a string',
      'amount property most be a positive',
      'description property most be a string',
    ]);
  });

  it('should receive and empty object', () => {
    const [err, dto] = FilterPaymentDto.create({} as any);
    expect(err).toBeUndefined();
    expect(dto).toBeInstanceOf(FilterPaymentDto);
  });
});
