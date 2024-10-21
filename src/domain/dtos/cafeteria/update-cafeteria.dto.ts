import { BooleanValidator } from '@src/domain/type-validators';

export class UpdateCafeteriaDto {
  private constructor(public readonly isServed: boolean) {}

  static create(props: Record<string, any>): [string?, UpdateCafeteriaDto?] {
    const { isServed } = props;

    const isServedValid = BooleanValidator.isValid(isServed);
    if (isServedValid !== true) return ['isServed ' + isServedValid, undefined];

    return [
      undefined,
      new UpdateCafeteriaDto(BooleanValidator.toBoolean(isServed)!),
    ];
  }
}
