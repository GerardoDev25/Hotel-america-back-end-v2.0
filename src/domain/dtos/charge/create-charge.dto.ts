import { ChargeType } from '@domain/interfaces';
import { ChargeValidator } from '.';

export class CreateChargeDto {
  private constructor(
    public readonly amount: number,
    public readonly type: ChargeType,
    public readonly registerId: string,
    public readonly description?: string
  ) {}

  static create(props: Record<string, any>): [string[]?, CreateChargeDto?] {
    const { amount, description, type, registerId } = props;

    const errors = ChargeValidator.create({
      amount,
      description,
      type,
      registerId,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new CreateChargeDto(
        +amount,
        type,
        (registerId as string).trim(),
        description ? (description as string).trim() : undefined
      ),
    ];
  }
}
