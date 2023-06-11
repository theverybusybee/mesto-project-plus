import { HttpStatus } from '../../utils/constants/responseStatusCodes';

export default class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.BAD_REQUEST;
  }
}
