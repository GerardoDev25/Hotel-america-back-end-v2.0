import { IPaymentFilterDto, PaymentType } from '@domain/interfaces';
import { PaymentValidator } from '.';

export class FilterPaymentDto implements IPaymentFilterDto {
  constructor(
    public readonly amount?: number,
    public readonly type?: PaymentType,
    public readonly description?: string,
    public readonly paidAt?: Date,
    public readonly registerId?: string
  ) {}

  static create(props: Record<string, any>): [string[]?, FilterPaymentDto?] {
    const { amount, type, description, paidAt, registerId } = props;

    const errors = PaymentValidator.filter({
      amount,
      type,
      description,
      paidAt,
      registerId,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new FilterPaymentDto(
        amount ? +amount : undefined,
        type ? type : undefined,
        description ? (description as string).trim() : undefined,
        paidAt ? new Date(paidAt) : undefined,
        registerId ? (registerId as string).trim() : undefined
      ),
    ];
  }
}
