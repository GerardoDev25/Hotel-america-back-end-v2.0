import { ChargeType, IChargeFilterDto } from '@domain/interfaces';
import { ChargeValidator } from '.';

export class FilterChargeDto implements IChargeFilterDto {
  constructor(
    public readonly amount?: number,
    public readonly type?: ChargeType,
    public readonly description?: string,
    public readonly createdAt?: Date,
    public readonly registerId?: string
  ) {}

  static create(props: Record<string, any>): [string[]?, FilterChargeDto?] {
    const { amount, type, description, createdAt, registerId } = props;

    const errors = ChargeValidator.filter({
      amount,
      type,
      description,
      createdAt,
      registerId,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new FilterChargeDto(
        amount ? +amount : undefined,
        type ? type : undefined,
        description ? (description as string).trim() : undefined,
        createdAt ? new Date(createdAt) : undefined,
        registerId ? (registerId as string).trim() : undefined
      ),
    ];
  }
}
