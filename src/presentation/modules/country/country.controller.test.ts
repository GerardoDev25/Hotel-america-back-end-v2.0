import { CountryList } from '@domain/interfaces';
import { CountryController } from '.';

describe('country.controller.ts', () => {
  const countriesResolve: CountryList = {
    ok: false,
    items: [],
  };

  it('should return all countries (getAll)', async () => {
    const res = { json: jest.fn() } as any;
    const req = {} as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue(countriesResolve),
    } as any;
    const countryController = new CountryController(mockService);

    await countryController.getAll(req, res);

    expect(mockService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(countriesResolve);
  });
});
