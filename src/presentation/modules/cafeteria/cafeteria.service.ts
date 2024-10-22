import { CafeteriaRepository } from '@domain/repositories';
import { UpdateCafeteriaDto } from '@domain/dtos/cafeteria';
export class CafeteriaService {
  constructor(private readonly cafeteriaRepository: CafeteriaRepository) {}

  getAll() {
    return this.cafeteriaRepository.getAll();
  }

  update(updateCafeteriaDto: UpdateCafeteriaDto) {
    return this.cafeteriaRepository.update(updateCafeteriaDto);
  }
}
