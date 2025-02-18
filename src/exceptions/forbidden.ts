import { ErrorCode, HttpException } from "./root";

export class ForbiddenException extends HttpException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, 403,errorCode,null!);
  }
}
