import { PaymentType } from '@domain/interfaces';
import { cleanObject } from '@src/utils';
import { PaymentValidator } from './payment-validator.dto';

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

    const createPaymentDto = cleanObject(
      new CreatePaymentDto(+amount, type, registerId, description)
    ) as CreatePaymentDto;

    return [undefined, createPaymentDto];
  }
}
