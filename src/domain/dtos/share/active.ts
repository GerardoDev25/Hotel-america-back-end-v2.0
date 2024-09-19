import { BooleanValidator } from '@domain/type-validators';

export class ActiveDto {
  private constructor(public readonly isActive: boolean | undefined) {}

  static create(isActive: any): [string?, ActiveDto?] {
    if (isActive === null || isActive === undefined) {
      return [undefined, new ActiveDto(undefined)];
    }

    const isActiveValid = BooleanValidator.toBoolean(isActive);

    if (isActiveValid === null) {
      return ['isActive most be true or false'];
    }

    return [undefined, new ActiveDto(isActiveValid)];
  }
}
