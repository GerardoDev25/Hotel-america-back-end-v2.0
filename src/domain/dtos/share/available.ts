import { BooleanValidator } from '@domain/type-validators';

export class AvailableDto {
  private constructor(public readonly isAvailable: boolean | undefined) {}

  static create(isAvailable: any): [string?, AvailableDto?] {
    if (isAvailable === null || isAvailable === undefined) {
      return [undefined, new AvailableDto(undefined)];
    }

    const isAvailableValid = BooleanValidator.toBoolean(isAvailable);

    if (isAvailableValid === null) {
      return ['isAvailable most be true or false'];
    }

    return [undefined, new AvailableDto(isAvailableValid)];
  }
}
