import { statusCodes } from '../../utils/constants/responseStatusCodes';

export default class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCodes.Conflict;
  }
}