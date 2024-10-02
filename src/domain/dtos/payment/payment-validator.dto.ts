import { CreatePayment, PaymentTypeList } from '@domain/interfaces';
import { NumberValidator, StringValidator } from '@domain/type-validators';

export class PaymentValidator {
  static create(object: CreatePayment) {
    const errors: string[] = [];
    const { amount, type, registerId, description } = object;

    // * type
    const typeValid = StringValidator.mostBe({
      value: type,
      allowValues: [
        PaymentTypeList.BACK,
        PaymentTypeList.CASH,
        PaymentTypeList.CREDIT_CART,
        PaymentTypeList.QR,
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
}
