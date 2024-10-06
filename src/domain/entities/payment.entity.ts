import { IPayment, PaymentType, PaymentTypeList } from '@domain/interfaces';
import {
  StringValidator,
  NumberValidator,
  DateValidator,
} from '@domain/type-validators';
import { CustomError } from '@domain/error';

export class PaymentEntity implements IPayment {
  id: string;
  amount: number;
  description?: string | undefined;
  paidAt: string;
  type: PaymentType;
  registerId: string;
  constructor(params: IPayment) {
    this.id = params.id;
    this.amount = params.amount;
    this.description = params.description;
    this.paidAt = params.paidAt;
    this.type = params.type;
    this.registerId = params.registerId;
  }

  private static verifyProperties(properties: IPayment) {
    const { id, amount, description, paidAt, type, registerId } = properties;

    // * id
    const idValid = StringValidator.isValidUUID(id);
    if (idValid !== true) throw CustomError.badRequest('id ' + idValid);

    // * paidAt
    const paidAtValidation = DateValidator.isValid(paidAt);
    if (paidAtValidation !== true)
      throw CustomError.badRequest('paidAt ' + paidAtValidation);

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
    if (typeValid !== true) throw CustomError.badRequest('type ' + typeValid);

    // * amount
    const amountValid = NumberValidator.isPositive(amount);
    if (amountValid !== true) {
      throw CustomError.badRequest(`amount ${amountValid}`);
    }

    //  * registerId
    const registerIdValid = StringValidator.isValidUUID(registerId);
    if (registerIdValid !== true) {
      throw CustomError.badRequest(`registerId ${registerIdValid}`);
    }

    // * description
    if (description !== undefined && description !== '') {
      const descriptionValid = StringValidator.isValid(description);
      if (descriptionValid !== true)
        throw CustomError.badRequest('description ' + descriptionValid);
    }
  }

  static fromObject(object: Record<string, any>) {
    const { id, amount, description, paidAt, type, registerId } = object;

    PaymentEntity.verifyProperties({
      id,
      amount,
      description,
      paidAt,
      type,
      registerId,
    });

    const paidAtValid = new Date(paidAt).toISOString().split('T').at(0);

    return new PaymentEntity({
      id,
      amount,
      description,
      paidAt: paidAtValid ?? paidAt,
      type,
      registerId,
    });
  }
}
