import { NextFunction, Response, Request } from "express";
import { ErrorCode, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";
import { ZodError } from "zod";
import { BadRequestException } from "./exceptions/badRequest";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else if (error instanceof ZodError) {
        console.error("Validation error details:", error.errors);
        exception = new BadRequestException(
          "Unprocessable Entity",
          ErrorCode.UNPROCESSABLE_ENTITY
        );
      } else {
        exception = new InternalException(
          "Something went wrong !!",
          error,
          ErrorCode.INTERNAL_EXCEPTION
        );
      }
      next(exception);
    }
  };
};
