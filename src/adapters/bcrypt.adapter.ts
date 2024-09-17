import { compareSync, genSaltSync, hashSync } from 'bcrypt';

export class BcryptAdapter {
  static hash = (term: string, salt: number = 10) => {
    const saltGen = genSaltSync(salt);
    const hash = hashSync(term, saltGen);
    return hash;
  };

  static compare = (term: string, hashed: string) => {
    return compareSync(term, hashed);
  };
}
