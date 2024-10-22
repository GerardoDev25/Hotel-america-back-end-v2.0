import { CafeteriaDatasource } from '@domain/datasources';
import { CafeteriaRepository } from '@domain/repositories';
import { CafeteriaList } from '@domain/interfaces';
import { UpdateCafeteriaDto } from '@src/domain/dtos/cafeteria';

export class CafeteriaRepositoryImpl extends CafeteriaRepository {
  constructor(private readonly cafeteriaDatasource: CafeteriaDatasource) {
    super();
  }

  getAll(): Promise<CafeteriaList> {
    return this.cafeteriaDatasource.getAll();
  }

  update(
    updateCafeteriaDto: UpdateCafeteriaDto
  ): Promise<{ ok: boolean; message: string }> {
    return this.cafeteriaDatasource.update(updateCafeteriaDto);
  }
}
