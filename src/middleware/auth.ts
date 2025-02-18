import { NextFunction, Response, Request } from "express";
import { ErrorCode, HttpException } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secret";
import { prismaCilient } from ".."; // Make sure the import name is correct

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // 1. Extract token from header
    const token = req.headers.authorization;

    // 2. if token is not present, throw an error of unauthorized.
    if (!token) {
        return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    }

    try {
        // 3. if the token is present, verify the token and extract the payload
        const payload = jwt.verify(token, JWT_SECRET) as any;

        // 4. get the user from the payload
        const user = await prismaCilient.user.findFirst({ where: { id: payload.userId } });

        // 5. if user not found, throw unauthorized error
        if (!user) {
            return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
        }

        // 6. attach the user to the current request object
        req.user = user;

        next();
    } catch (error) {
        // 7. Handle jwt verification errors and other errors
        return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    }
};

export default authMiddleware;
