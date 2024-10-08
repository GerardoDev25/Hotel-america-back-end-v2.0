import { Generator } from '@src/utils/generator';
import { ICharge, chargeTypeList } from '@domain/interfaces';
import { Uuid } from '@src/adapters';
import { ChargeEntity } from '.';

describe('charge.entity.ts', () => {
  const chargeValid: ICharge = {
    id: Uuid.v4(),
    amount: 100,
    createdAt: Generator.randomDate(),
    type: chargeTypeList.CAFETERIA,
    registerId: Uuid.v4(),
  };

  test('should get valid charge with valid object', () => {
    const result = ChargeEntity.fromObject(chargeValid);
    expect(result).toBeInstanceOf(ChargeEntity);
  });

  test('should throw error register with invalid properties', () => {
    const invalidId = 'Uuid.v4()';
    const invalidAmount = -12;
    const invalidCreatedAt = 'Generator.randomDate()';
    const invalidType = 'chargeTypeList.BACK';
    const invalidDescription = false;
    const invalidRegisterId = 'Uuid.v4()';

    expect(() =>
      ChargeEntity.fromObject({ ...chargeValid, id: invalidId })
    ).toThrow();

    expect(() =>
      ChargeEntity.fromObject({ ...chargeValid, amount: invalidAmount })
    ).toThrow();

    expect(() =>
      ChargeEntity.fromObject({ ...chargeValid, createdAt: invalidCreatedAt })
    ).toThrow();

    expect(() =>
      ChargeEntity.fromObject({
        ...chargeValid,
        description: invalidDescription,
      })
    ).toThrow();

    expect(() =>
      ChargeEntity.fromObject({ ...chargeValid, type: invalidType })
    ).toThrow();

    expect(() =>
      ChargeEntity.fromObject({
        ...chargeValid,
        registerId: invalidRegisterId,
      })
    ).toThrow();
  });
});
