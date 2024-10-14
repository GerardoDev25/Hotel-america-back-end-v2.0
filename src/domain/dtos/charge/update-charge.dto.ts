import { ChargeType } from '@domain/interfaces';
import { ChargeValidator } from '.';

export class UpdateChargeDto {
  constructor(
    public readonly id: string,
    public readonly amount?: number,
    public readonly type?: ChargeType,
    public readonly description?: string
  ) {}

  static create(props: Record<string, any>): [string[]?, UpdateChargeDto?] {
    const { id, amount, description, type } = props;

    const errors = ChargeValidator.update({
      id,
      amount,
      description,
      type,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new UpdateChargeDto(
        id,
        amount ? +amount : undefined,
        type ? type : undefined,
        description ? (description as string).trim() : undefined
      ),
    ];
  }
}
