import {
  ChargeFilter,
  ChargeTypeList,
  CreateCharge,
  UpdateCharge,
} from '@domain/interfaces';
import {
  DateValidator,
  NumberValidator,
  StringValidator,
} from '@domain/type-validators';

export class ChargeValidator {
  static create(object: CreateCharge) {
    const errors: string[] = [];
    const { amount, type, registerId, description } = object;

    // * type
    const typeValid = StringValidator.mostBe({
      value: type,
      allowValues: [
        ChargeTypeList.CAFETERIA,
        ChargeTypeList.LAUNDRY,
        ChargeTypeList.LODGING,
        ChargeTypeList.OTHER,
        ChargeTypeList.NEW_GUEST,
      ],
    });
    if (typeValid !== true) errors.push('type ' + typeValid);

    // * amount
    const amountValid = NumberValidator.isPositive(amount);
    if (amountValid !== true) {
      errors.push(`amount ${amountValid}`);
    }

    //  * registerId
    const registerIdValid = StringValidator.isValidUUID(registerId);
    if (registerIdValid !== true) {
      errors.push(`registerId ${registerIdValid}`);
    }

    // * description
    if (description !== undefined) {
      const descriptionValid = StringValidator.isValid(description);
      if (descriptionValid !== true)
        errors.push('description ' + descriptionValid);
    }
    return errors;
  }

  static filter(object: ChargeFilter) {
    const errors: string[] = [];
    const { amount, type, description, createdAt, registerId } = object;

    // * registerId
    if (registerId !== undefined) {
      const registerIdValid = StringValidator.isValidUUID(registerId);
      if (registerIdValid !== true)
        errors.push(`registerId ${registerIdValid}`);
    }

    // * createdAt
    if (createdAt !== undefined) {
      const createdAtValid = DateValidator.isValid(createdAt);
      if (createdAtValid !== true) errors.push('createdAt ' + createdAtValid);
    }

    // * type
    if (type !== undefined) {
      const typeValid = StringValidator.mostBe({
        value: type,
        allowValues: [
          ChargeTypeList.CAFETERIA,
          ChargeTypeList.LAUNDRY,
          ChargeTypeList.LODGING,
          ChargeTypeList.OTHER,
          ChargeTypeList.NEW_GUEST,
        ],
      });
      if (typeValid !== true) errors.push('type ' + typeValid);
    }

    // * amount
    if (amount !== undefined) {
      const amountValid = NumberValidator.isPositive(amount);
      if (amountValid !== true) {
        errors.push(`amount ${amountValid}`);
      }
    }

    // * description
    if (description !== undefined) {
      const descriptionValid = StringValidator.isValid(description);
      if (descriptionValid !== true)
        errors.push('description ' + descriptionValid);
    }
    return errors;
  }
  static update(object: UpdateCharge) {
    const errors: string[] = [];
    const { id, amount, type, description } = object;

    // * id
    const idValid = StringValidator.isValidUUID(id);
    if (idValid !== true) errors.push(`id ${idValid}`);

    // * type
    if (type !== undefined) {
      const typeValid = StringValidator.mostBe({
        value: type,
        allowValues: [
          ChargeTypeList.CAFETERIA,
          ChargeTypeList.LAUNDRY,
          ChargeTypeList.LODGING,
          ChargeTypeList.OTHER,
          ChargeTypeList.NEW_GUEST,
        ],
      });
      if (typeValid !== true) errors.push('type ' + typeValid);
    }

    // * amount
    if (amount !== undefined) {
      const amountValid = NumberValidator.isPositive(amount);
      if (amountValid !== true) {
        errors.push(`amount ${amountValid}`);
      }
    }

    // * description
    if (description !== undefined) {
      const descriptionValid = StringValidator.isValid(description);
      if (descriptionValid !== true)
        errors.push('description ' + descriptionValid);
    }
    return errors;
  }
}
