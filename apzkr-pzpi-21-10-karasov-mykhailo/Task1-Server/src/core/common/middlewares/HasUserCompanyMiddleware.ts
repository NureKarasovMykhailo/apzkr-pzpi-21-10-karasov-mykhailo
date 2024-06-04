import {NextFunction, Response, Request} from "express";
import ApiError from "../error/ApiError";
import i18n from "i18n";

function hasUserCompanyMiddleware(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    if (!req.user.companyId) {
        return next(ApiError.forbidden(i18n.__('youHaveNotCompany')));
    } else {
        next();
    }
}

export default hasUserCompanyMiddleware;