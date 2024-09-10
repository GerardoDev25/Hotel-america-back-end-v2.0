import { CustomError } from '../error';
import { IRegister } from '../interfaces';
import {
  DateValidator,
  NumberValidator,
  StringValidator,
} from '../type-validators';

export class RegisterEntity implements IRegister {
  id: string;
  checkIn: string;
  checkOut?: string | undefined;
  guestsNumber: number;
  discount: number;
  price: number;
  userId: string;
  roomId: string;
  constructor(params: IRegister) {
    this.id = params.id;
    this.checkIn = params.checkIn;
    this.checkOut = params.checkOut;
    this.guestsNumber = params.guestsNumber;
    this.discount = params.discount;
    this.price = params.price;
    this.userId = params.userId;
    this.roomId = params.roomId;
  }

  private static verifyProperties(properties: IRegister) {
    const {
      id,
      checkIn,
      checkOut,
      guestsNumber,
      discount,
      price,
      userId,
      roomId,
    } = properties;

    // * id
    const idValidation = StringValidator.isValidUUID(id);
    if (idValidation !== true) {
      throw CustomError.badRequest('id ' + idValidation);
    }

    // * checkIn
    const checkInValidation = DateValidator.isValid(checkIn);
    if (checkInValidation !== true)
      throw CustomError.badRequest('checkIn ' + checkInValidation);

    // * checkOut
    if (checkOut) {
      const checkOutValidation = DateValidator.isValid(checkIn);
      if (checkOutValidation !== true)
        throw CustomError.badRequest('checkOut ' + checkOutValidation);
    }

    // * guestsNumber
    const guestsNumberValidation = NumberValidator.isValid(guestsNumber);
    if (guestsNumberValidation !== true) {
      throw CustomError.badRequest('discount ' + guestsNumberValidation);
    }

    // * discount
    const discountValidation = NumberValidator.isValid(discount);
    if (discountValidation !== true) {
      throw CustomError.badRequest('discount ' + discountValidation);
    }

    // * price
    const priceValidation = NumberValidator.isValid(price);
    if (priceValidation !== true) {
      throw CustomError.badRequest('price ' + priceValidation);
    }

    // * userId
    const userIdValidation = StringValidator.isValidUUID(userId);
    if (userIdValidation !== true) {
      throw CustomError.badRequest('userId ' + userIdValidation);
    }

    // * roomId
    const roomIdValidation = StringValidator.isValidUUID(roomId);
    if (roomIdValidation !== true) {
      throw CustomError.badRequest('roomId ' + roomIdValidation);
    }
  }

  static fromObject(object: Record<string, any>) {
    const {
      id,
      checkIn,
      checkOut,
      guestsNumber,
      discount,
      price,
      userId,
      roomId,
    } = object;

    this.verifyProperties({
      id,
      checkIn,
      checkOut,
      guestsNumber,
      discount,
      price,
      userId,
      roomId,
    });

    const checkOutValid = checkOut
      ? new Date(checkOut).toISOString().split('T').at(0)
      : undefined;

    return new RegisterEntity({
      id,
      checkIn: new Date(checkIn).toISOString().split('T').at(0) ?? checkIn,
      checkOut: checkOutValid,
      guestsNumber,
      discount,
      price,
      userId,
      roomId,
    });
  }
}
