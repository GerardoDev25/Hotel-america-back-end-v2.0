import { CountryDatasource } from '@domain/datasources';
export class CountryService {
  constructor(private readonly countryDatasource: CountryDatasource) {}

  getAll() {
    return this.countryDatasource.getAll();
  }
}
