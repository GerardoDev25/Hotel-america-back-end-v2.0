import { NextFunction, Request, Response } from 'express';
import { StringValidator } from '@domain/type-validators';

export class Commons {
  static isValidUUID(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const idValid = StringValidator.isValidUUID(id);
    if (idValid !== true)
      return res.status(400).json({ ok: false, errors: ['id ' + idValid] });

    next();
  }
}
