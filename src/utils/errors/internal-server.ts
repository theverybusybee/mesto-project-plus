import { HttpStatus } from '../../utils/constants/responseStatusCodes';

export default class InternalServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.InternalServerError;
  }
}
