import { statusCodes } from '../../utils/constants/responseStatusCodes';

export default class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCodes.Unauthorized;
  }
}