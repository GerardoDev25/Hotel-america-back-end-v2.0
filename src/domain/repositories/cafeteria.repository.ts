import { UpdateCafeteriaDto } from '@domain/dtos';
import { CafeteriaList } from '@domain/interfaces';

export abstract class CafeteriaRepository {
  abstract getAll(): Promise<CafeteriaList>;

  abstract update(
    updateCafeteriaDto: UpdateCafeteriaDto
  ): Promise<{ ok: boolean; message: string }>;
}
