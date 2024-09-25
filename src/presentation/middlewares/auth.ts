import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@domain/interfaces';
import { UserDatasource } from '@domain/datasources';
import { UserEntity } from '@domain/entities';
import { CustomError } from '@domain/error';
import { JwtAdapter } from '@src/adapters';

export class Auth {
  constructor(private readonly userDatasource: UserDatasource) {}

  private static handleError(error: any) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  validateJwt = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('Authorization');
    if (!authorization) {
      return res
        .status(401)
        .json({ ok: false, errors: ['Token not provided'] });
    }

    if (!authorization.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ ok: false, errors: ['invalid Bearer Token'] });
    }

    const token = authorization.split(' ').at(1) ?? '';

    try {
      const payload = await JwtAdapter.verifyToken<{ id: string }>(token);

      if (!payload) {
        return res.status(401).json({ ok: false, errors: ['Invalid Token'] });
      }
      const { user } = await this.userDatasource.getById(payload.id);

      if (!user.isActive) {
        return res.status(401).json({ ok: false, errors: ['user not active'] });
      }

      req.body.user = UserEntity.fromObject(user);

      next();
    } catch (error) {
      throw Auth.handleError(error);
    }
  };

  static verifyRole = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.body.user as UserEntity;

      if (!user)
        return res
          .status(401)
          .json({ ok: false, errors: ['resource user not allow'] });

      if (!roles.includes(user.role)) {
        return res
          .status(403)
          .json({ ok: false, errors: ['resource forbidden for the user'] });
      }

      req.body.userId = user.id;
      next();
    };
  };
}
