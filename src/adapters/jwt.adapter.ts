import jwt from 'jsonwebtoken';
import { envs } from './../config/envs';

const jwt_seed = envs.JWT_SEED;
const jwt_duration = envs.JWT_DURATION;

interface GenerateProps {
  payload: any;
  expiresIn?: string;
}

export class JwtAdapter {
  static async generateToken(param: GenerateProps): Promise<string> {
    const { payload, expiresIn = '10h' } = param;

    return new Promise((resolve, reject) => {
      jwt.sign(payload, jwt_seed, { expiresIn: 36000 }, (err, token) => {
        console.log({ err, payload, expiresIn });
        if (err) return reject('error white create token');
        return resolve(token!);
      });
    });
  }

  static verifyToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, jwt_seed, (err, decoded) => {
        if (err) return resolve(null);
        return resolve(decoded as T);
      });
    });
  }
}
