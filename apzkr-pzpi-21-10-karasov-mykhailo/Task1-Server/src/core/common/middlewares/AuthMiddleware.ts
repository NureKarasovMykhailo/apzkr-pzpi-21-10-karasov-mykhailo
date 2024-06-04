import {NextFunction, Request, Response} from "express";
import ApiError from "../error/ApiError";
import jwt from 'jsonwebtoken';
import {JWT_SECRET_KEY} from "../../../config";
import {User} from "../../../types/types";
import i18n from "i18n";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const token: string | undefined= req.headers.authorization?.split(' ')[1];
        if (!token) {
            return next(ApiError.unauthorized(i18n.__('unauthorized')));
        }

        req.user = jwt.verify(token, JWT_SECRET_KEY) as User;
        next();
    } catch (error) {
        return next(ApiError.unauthorized(i18n.__('unauthorized')));
    }
}

export default authMiddleware;