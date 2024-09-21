import { Request, Response, NextFunction } from 'express';
import { UserDatasource } from '@domain/datasources';
import { UserEntity } from '@domain/entities';
import { JwtAdapter } from '@src/adapters';

export class Auth {
  constructor(private readonly userDatasource: UserDatasource) {}

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

      if (!user) {
        return res
          .status(401)
          .json({ ok: false, errors: ['Invalid token - user'] });
      }

      if (!user.isActive) {
        return res.status(401).json({ ok: false, errors: ['user not active'] });
      }

      req.body.user = UserEntity.fromObject(user);

      next();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return res
        .status(500)
        .json({ ok: false, errors: ['internal server error'] });
    }
  };

  verifyRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.body.user as UserEntity;

      if (!user)
        return res
          .status(401)
          .json({ ok: false, errors: ['resource user not allow'] });

      if (role !== user.role) {
        return res
          .status(403)
          .json({ ok: false, errors: ['resource forbidden for the user'] });
      }

      next();
    };
  };
}
