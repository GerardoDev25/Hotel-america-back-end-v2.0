import { CafeteriaDatasource } from '@domain/datasources';
import { UpdateCafeteriaDto } from '@domain/dtos/cafeteria';
export class CafeteriaService {
  constructor(private readonly cafeteriaDatasource: CafeteriaDatasource) {}

  getAll() {
    return this.cafeteriaDatasource.getAll();
  }

  update(updateCafeteriaDto: UpdateCafeteriaDto) {
    return this.cafeteriaDatasource.update(updateCafeteriaDto);
  }
}
