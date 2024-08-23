import { NextFunction, Request, Response } from 'express';
import { variables } from '../../../config';
import { RoomTypesList } from '../../../domain/interfaces';
import {
  StringValidator,
  NumberValidator,
  BooleanValidator,
} from '../../../domain/type-validators';

export class CheckDataRoom {
  static create(req: Request, res: Response, next: NextFunction) {
    let { roomType, roomNumber, betsNumber, isAvailable = false } = req.body;

    const errors: string[] = [];

    // * roomType
    const roomTypeValid = StringValidator.mostBe({
      value: roomType,
      allowValues: [RoomTypesList.SUIT, RoomTypesList.NORMAL],
    });
    if (roomTypeValid !== true) errors.push('roomType ' + roomTypeValid);

    // * roomNumber
    const roomNumberMinValueValid = NumberValidator.isMinValue({
      value: roomNumber,
      minValue: variables.ROOM_NUMBER_MIN_VALUE,
    });
    if (roomNumberMinValueValid !== true)
      errors.push('roomNumber ' + roomNumberMinValueValid);

    // * betsNumber
    const betsNumberMinValueValid = NumberValidator.isMinValue({
      value: betsNumber,
      minValue: variables.BETS_NUMBER_MIN_VALUE,
    });
    if (betsNumberMinValueValid !== true)
      errors.push('betsNumber ' + betsNumberMinValueValid);

    // * isAvailable
    const isAvailableValid = BooleanValidator.isValid(isAvailable);
    if (isAvailableValid !== true)
      errors.push('isAvailable ' + isAvailableValid);

    if (errors.length > 0) {
      return res.status(400).json({ ok: false, errors });
    }

    next();
  }

  static update(req: Request, res: Response, next: NextFunction) {
    const { id, roomType, roomNumber, betsNumber, isAvailable } = req.body;

    const errors: string[] = [];

    // * id
    const idValid = StringValidator.isValid(id);
    if (idValid !== true) errors.push('id ' + idValid);

    // * roomType
    if (roomType !== undefined) {
      const roomTypeValid = StringValidator.mostBe({
        value: roomType,
        allowValues: [RoomTypesList.SUIT, RoomTypesList.NORMAL],
      });
      if (roomTypeValid !== true) errors.push('roomType ' + roomTypeValid);
    }

    // * roomNumber
    if (roomNumber !== undefined) {
      const roomNumberMinValueValid = NumberValidator.isMinValue({
        value: roomNumber,
        minValue: variables.ROOM_NUMBER_MIN_VALUE,
      });
      if (roomNumberMinValueValid !== true)
        errors.push('roomNumber ' + roomNumberMinValueValid);
    }

    // * betsNumber
    if (betsNumber !== undefined) {
      const betsNumberMinValueValid = NumberValidator.isMinValue({
        value: betsNumber,
        minValue: variables.BETS_NUMBER_MIN_VALUE,
      });
      if (betsNumberMinValueValid !== true)
        errors.push('betsNumber ' + betsNumberMinValueValid);
    }

    // * isAvailable
    if (isAvailable !== undefined) {
      const isAvailableValid = BooleanValidator.isValid(isAvailable);
      if (isAvailableValid !== true)
        errors.push('isAvailable ' + isAvailableValid);
    }

    if (errors.length > 0) {
      return res.status(400).json({ ok: false, errors });
    }

    next();
  }
}
