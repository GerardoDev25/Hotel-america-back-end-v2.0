import { CustomError } from '@domain/error';
import { CountryDatasource } from '@domain/datasources';
import { CountryList } from '@domain/interfaces';

import { prisma } from '@src/data/postgres';
import { LoggerService } from '@presentation/services';

export class CountryDatasourceImpl extends CountryDatasource {
  constructor(private readonly logger: LoggerService) {
    super();
  }

  private handleError(error: any) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      this.logger.error((error as Error).message);
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  async getAll(): Promise<CountryList> {
    try {
      const countries = await prisma.country.findMany();

      return { ok: true, items: countries };
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
