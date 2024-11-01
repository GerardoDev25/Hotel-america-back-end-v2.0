import {
  PaymentType,
  CreatePayment,
  PaymentFilter,
  UpdatePayment,
} from '@domain/interfaces';
import {
  DateValidator,
  NumberValidator,
  StringValidator,
} from '@domain/type-validators';

export class PaymentValidator {
  static allowValues: PaymentType[] = ['bank', 'cash', 'credit_cart', 'qr'];
  static create(object: CreatePayment) {
    const errors: string[] = [];
    const { amount, type, registerId, description } = object;

    // * type
    const typeValid = StringValidator.mostBe({
      value: type,
      allowValues: PaymentValidator.allowValues,
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

  static filter(object: PaymentFilter) {
    const errors: string[] = [];
    const { amount, type, description, paidAt, registerId } = object;

    // * registerId
    if (registerId !== undefined) {
      const registerIdValid = StringValidator.isValidUUID(registerId);
      if (registerIdValid !== true)
        errors.push(`registerId ${registerIdValid}`);
    }

    // * paidAt
    if (paidAt !== undefined) {
      const paidAtValid = DateValidator.isValid(paidAt);
      if (paidAtValid !== true) errors.push('paidAt ' + paidAtValid);
    }

    // * type
    if (type !== undefined) {
      const typeValid = StringValidator.mostBe({
        value: type,
        allowValues: PaymentValidator.allowValues,
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

  static update(object: UpdatePayment) {
    const errors: string[] = [];
    const { id, amount, type, description } = object;

    // * id
    const idValid = StringValidator.isValidUUID(id);
    if (idValid !== true) errors.push(`id ${idValid}`);

    // * type
    if (type !== undefined) {
      const typeValid = StringValidator.mostBe({
        value: type,
        allowValues: PaymentValidator.allowValues,
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
