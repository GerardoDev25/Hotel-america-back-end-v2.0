import { v4 as UUID } from 'uuid';

export class Uuid {
  constructor() {}

  static v4(): string {
    return UUID();
  }
}
