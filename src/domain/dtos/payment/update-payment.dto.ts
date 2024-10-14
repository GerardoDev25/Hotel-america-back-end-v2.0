import { PaymentType } from '@domain/interfaces';
import { PaymentValidator } from '.';

export class UpdatePaymentDto {
  constructor(
    public readonly id: string,
    public readonly amount?: number,
    public readonly type?: PaymentType,
    public readonly description?: string
  ) {}

  static create(props: Record<string, any>): [string[]?, UpdatePaymentDto?] {
    const { id, amount, description, type } = props;

    const errors = PaymentValidator.update({
      id,
      amount,
      description,
      type,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new UpdatePaymentDto(
        (id as string).trim(),
        amount ? +amount : undefined,
        type ? type : undefined,
        description ? (description as string).trim() : undefined
      ),
    ];
  }
}
