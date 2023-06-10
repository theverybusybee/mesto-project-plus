import { statusCodes } from 'constants/responseStatusCodes';

export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCodes.NotFound;
  }
}
