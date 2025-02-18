import { HttpException } from "./root";


export class InternalException extends HttpException {
   constructor(message: string, errors: any, errorCode: number){
    super(message,500,errorCode,errors)
   }
}