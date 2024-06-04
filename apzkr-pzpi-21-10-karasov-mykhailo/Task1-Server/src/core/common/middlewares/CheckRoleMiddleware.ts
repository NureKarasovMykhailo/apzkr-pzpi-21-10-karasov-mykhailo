import {NextFunction, Request, Response} from "express";
import ApiError from "../error/ApiError";
import jwt from "jsonwebtoken";
import {JWT_SECRET_KEY} from "../../../config";
import RoleMapper from "../../../infrastructure/mappers/RoleMapper/RoleMapper";
import RoleDomainModel from "../../domain/models/Role/Role";
import i18n from 'i18n';


function checkRoleMiddleware(roles: string[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        if (req.method === 'OPTIONS') {
            next();
        }
        try {
            let hasAccess = false;
            const roleMapper = new RoleMapper();
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return next(ApiError.unauthorized(i18n.__('unauthorized')));
            }
            const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
            // @ts-ignore
            let userRoles: RoleDomainModel[] = decodedToken.roles.map(role => {
                return roleMapper.toDomainModel(role);
            });
            userRoles.map(userRole => {
               roles.map(role => {
                    if (role === userRole.roleTitle) {
                        hasAccess = true;
                    }
               });
            });
            if (hasAccess) {
                // @ts-ignore
                req.user = jwt.verify(token, JWT_SECRET_KEY);
                next();
            } else {
                return next(ApiError.forbidden(i18n.__('notAccess')))
            }
        } catch (error) {
            return next(ApiError.forbidden(i18n.__('notAccess')));
        }
    }
}

export default checkRoleMiddleware;