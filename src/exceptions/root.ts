// message,statusCode,errorCode,error

export class HttpException extends Error {
   message: string;
   statusCode: number;
   errorCode: any;
   errors: ErrorCode;

   constructor(message: string,statusCode: number,errorCode: ErrorCode,errors: any){
    super(message)
    this.message = message
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.errors = errors
   }
}

export enum ErrorCode {
  OTP_NOT_FOUND = 1000,
  INVALID_OTP = 1000,
  DASHBOARD_OVERVIEW_NOT_FOUND = 6000,
  FILE_TOO_LARGE = 413, // Payload Too Large
  BAD_REQUEST = 400, // Bad Request
  INVALID_FILE_UPLOAD = 400, // Unprocessable Entity
  ROLE_ALREADY_SAME = 400, // Bad Request
  ORDER_ID_REQUIRED = 400, // Bad Request
  ORDER_ALREADY_CANCELLED = 400, // Bad Request
  ORDER_NOT_FOUND = 404, // Not Found
  CART_EMPTY = 400, // Bad Request
  CART_ITEM_NOT_FOUND = 404, // Not Found
  USER_NOT_FOUND = 404, // Not Found
  USER_ALREADY_EXISTS = 409, // Conflict
  INCORRECT_PASSWORD = 401, // Unauthorized
  INVALID_TOKEN = 401, // Unauthorized
  TOKEN_EXPIRED = 401, // Unauthorized
  TOKEN_NOT_FOUND = 401, // Unauthorized
  TOKEN_INVALID = 401, // Unauthorized
  TOKEN_REVOKED = 401, // Unauthorized
  UNPROCESSABLE_ENTITY = 422, // Unprocessable Entity
  FORBIDDEN = 403, // Forbidden

  // Server-side errors (5xx)
  INTERNAL_ERROR = 500, // Internal Server Error
  INVALID_PASSWORD = 500, // Internal Server Error
  UNAUTHORIZED = 401, // Not changed, already maps to "Unauthorized"
  INTERNAL_EXCEPTION = 500, // Internal Server Error
  ADDRESS_NOT_FOUND = 404, // Not Found
  PRODUCT_NOT_FOUND = 404, // Not Found
  ADDRESS_DOES_NOT_BELONG = 400, // Bad Request
}