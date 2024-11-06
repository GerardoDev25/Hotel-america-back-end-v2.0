import { CountryDatasource } from '@domain/datasources';
import { CountryService } from './country.service';

describe('country.service.ts', () => {
  const countryDatasource: CountryDatasource = { getAll: jest.fn() };

  it('should get all countries (getAll)', async () => {
    const countriesService = new CountryService(countryDatasource);

    await countriesService.getAll();

    expect(countryDatasource.getAll).toHaveBeenCalled();
  });
});
