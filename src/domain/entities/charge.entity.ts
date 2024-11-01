import { ICharge, ChargeType } from '@domain/interfaces';
import {
  StringValidator,
  NumberValidator,
  DateValidator,
} from '@domain/type-validators';
import { CustomError } from '@domain/error';

export class ChargeEntity implements ICharge {
  id: string;
  amount: number;
  description?: string | undefined;
  createdAt: string;
  type: ChargeType;
  registerId: string;
  constructor(params: ICharge) {
    this.id = params.id;
    this.amount = params.amount;
    this.description = params.description;
    this.createdAt = params.createdAt;
    this.type = params.type;
    this.registerId = params.registerId;
  }

  private static verifyProperties(properties: ICharge) {
    const { id, amount, description, createdAt, type, registerId } = properties;

    // * id
    const idValid = StringValidator.isValidUUID(id);
    if (idValid !== true) throw CustomError.badRequest('id ' + idValid);

    // * createdAt
    const createdAtValidation = DateValidator.isValid(createdAt);
    if (createdAtValidation !== true)
      throw CustomError.badRequest('createdAt ' + createdAtValidation);

    // * type
    const typeValid = StringValidator.mostBe({
      value: type,
      allowValues: ['cafeteria', 'laundry', 'lodging', 'other', 'new_guest'],
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
    const { id, amount, description, createdAt, type, registerId } = object;

    ChargeEntity.verifyProperties({
      id,
      amount,
      description,
      createdAt,
      type,
      registerId,
    });

    const createdAtValid = new Date(createdAt).toISOString().split('T').at(0);

    return new ChargeEntity({
      id,
      amount,
      description,
      createdAt: createdAtValid ?? createdAt,
      type,
      registerId,
    });
  }
}
