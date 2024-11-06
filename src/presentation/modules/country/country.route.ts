import { Router } from 'express';
import { LoggerService } from '@presentation/services';
import { CountryDatasourceImpl } from '@infrastructure/datasource';
import { CountryService, CountryController } from '.';

export class CountryRoute {
  static get routes(): Router {
    const route = Router();

    const logger = new LoggerService('country.datasource.impl.ts');
    const countryDatasource = new CountryDatasourceImpl(logger);
    const countryService = new CountryService(countryDatasource);
    const countryController = new CountryController(countryService);

    route.get('/', countryController.getAll);
    return route;
  }
}
