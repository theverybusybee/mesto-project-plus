import { INTERNAL_SERVER_ERROR } from 'constants/responseStatusCodes';

export default class InternalServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = INTERNAL_SERVER_ERROR;
  }
}
