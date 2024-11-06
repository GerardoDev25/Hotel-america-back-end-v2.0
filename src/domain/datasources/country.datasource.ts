import { CountryList } from '@domain/interfaces';

export abstract class CountryDatasource {
  abstract getAll(): Promise<CountryList>;
}
