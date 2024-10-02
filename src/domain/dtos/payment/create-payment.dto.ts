import { PaymentType } from '@domain/interfaces';
import { PaymentValidator } from '.';

export class CreatePaymentDto {
  private constructor(
    public readonly amount: number,
    public readonly type: PaymentType,
    public readonly registerId: string,
    public readonly description?: string
  ) {}

  static create(props: Record<string, any>): [string[]?, CreatePaymentDto?] {
    const { amount, description, type, registerId } = props;

    const errors = PaymentValidator.create({
      amount,
      description,
      type,
      registerId,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new CreatePaymentDto(+amount, type, registerId, description),
    ];
  }
}
