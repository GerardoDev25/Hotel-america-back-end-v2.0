import { UpdateCafeteriaDto } from '@domain/dtos/cafeteria';
import { CafeteriaList } from '@domain/interfaces';

export abstract class CafeteriaRepository {
  abstract getAll(): Promise<CafeteriaList>;

  abstract update(
    updateCafeteriaDto: UpdateCafeteriaDto
  ): Promise<{ ok: boolean; message: string }>;
}
