import { BcryptAdapter } from './bcrypt.adapter';

describe('bcrypt.adapter.ts', () => {
  it('should generate a hash for a given term with default salt value', () => {
    const term = 'password123';

    const hash = BcryptAdapter.hash(term);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(term);
  });

  it('should return true when comparing matching term and hash', () => {
    const term = 'password123';
    const hash = BcryptAdapter.hash(term);

    const result = BcryptAdapter.compare(term, hash);

    expect(result).toBe(true);
  });
});
