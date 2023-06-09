import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

app.use(
  (
    err: ErrorRequestHandler,
    res: Response,
    req: Request,
    next: NextFunction
  ) => {}
);
