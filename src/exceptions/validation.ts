import { ErrorCode, HttpException } from "./root";

export class unProcessableEntity extends HttpException {
    constructor(error : any,message : string, errorCode: number){
        super(message,422,errorCode,error)
    }

}