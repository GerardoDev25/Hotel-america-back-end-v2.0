import { Uuid } from './uuid.adapter';
import { validate as validateUUID } from 'uuid';

describe('uuid.adapter.ts', () => {
  it('should generate a valid UUID v4 string when called', () => {
    const uuid = Uuid.v4();

    const isValid = validateUUID(uuid);

    expect(isValid).toBe(true);
  });
});
