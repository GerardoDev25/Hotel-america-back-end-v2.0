import { CountryList, ICountry } from '@domain/interfaces';
import { CountryDatasource } from '.';

describe('cafeteria.datasource.ts', () => {
  const country: ICountry = { id: '', name: '' };

  const countryList: CountryList = { ok: true, items: [country] };

  class MockCountryDatabase extends CountryDatasource {
    async getAll(): Promise<CountryList> {
      return countryList;
    }
  }

  const mockCountryDatabase = new MockCountryDatabase();

  test('should call method (getAll)', async () => {
    const result = await mockCountryDatabase.getAll();
    expect(result).toEqual(countryList);
  });
});
