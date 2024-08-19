import { Router } from 'express';

export class AppRoute {
  constructor() {}

  static get router(): Router {
    const route = Router();

    return route;
  }
}
