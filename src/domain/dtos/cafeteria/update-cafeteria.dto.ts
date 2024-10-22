import { BooleanValidator, StringValidator } from '@src/domain/type-validators';

export class UpdateCafeteriaDto {
  private constructor(
    public readonly id: string,
    public readonly isServed: boolean
  ) {}

  static create(props: Record<string, any>): [string[]?, UpdateCafeteriaDto?] {
    const { isServed, id } = props;

    const errors: string[] = [];

    // * id
    const idValid = StringValidator.isValidUUID(id);
    if (idValid !== true) errors.push(`id ${idValid}`);

    const isServedValid = BooleanValidator.isValid(isServed);
    if (isServedValid !== true) errors.push('isServed ' + isServedValid);

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new UpdateCafeteriaDto(
        (id as string).trim(),
        BooleanValidator.toBoolean(isServed)!
      ),
    ];
  }
}
