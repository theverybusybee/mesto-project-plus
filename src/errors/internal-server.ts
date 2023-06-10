import { statusCodes } from 'constants/responseStatusCodes';

export default class InternalServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCodes.InternalServerError;
  }
}
