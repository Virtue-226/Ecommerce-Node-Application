import {NextFunction, Request,Response} from 'express';
import { prismaCilient } from '..';
import {compareSync, hashSync} from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secret';
import { BadRequestException } from '../exceptions/badRequest';
import { ErrorCode } from '../exceptions/root';
import { unProcessableEntity } from '../exceptions/validation';
import { signUpSchema } from '../schema/users';
import { NotFoundException } from '../exceptions/notFound';

export const signUp = async (req:Request, res:Response,next:NextFunction) => {
  signUpSchema.parse(req.body)
  const {email,password,name} = req.body;

 // check if user already exist
  let user = await prismaCilient.user.findFirst({where: {email}})
  if (user){
    // throw Error("User already exists")
   throw new BadRequestException("User already exist!", ErrorCode.USER_ALREADY_EXISTS)
  }
  user = await prismaCilient.user.create({
    data: {
        name,
        email,
        password: hashSync(password,10)
    }
  })
  res.json(user)
  // try {
  
  // }catch(e: any){
  // next(new unProcessableEntity(e?.issues, "unprocessable entity",ErrorCode.UNPROCESSABLE_ENTITY ))
  // }
}

export const login = async (req:Request, res:Response) => {
    const {email,password} = req.body;

 // check if user already exist
  let user = await prismaCilient.user.findFirst({where: {email}})
  if (!user){
    throw new NotFoundException("User not found.", ErrorCode.USER_NOT_FOUND)
  }
  if(!compareSync(password,user.password)){
    throw new BadRequestException("InCorrect Password", ErrorCode.INCORRECT_PASSWORD)
  }

  const token = jwt.sign({
    userId : user.id,   
  },JWT_SECRET)

  res.json({user,token})
}

// /me -> return the logged in data
export const me = async (req:Request, res: Response) => {
  res.json(req?.user)
}