import {Request, Response, NextFunction} from "express";
import i18n from 'i18n';

export default function localizationMiddleware(req: Request, res: Response, next: NextFunction) {

    try {
        const lang = req.headers['accept-language'];
        i18n.setLocale(lang || 'uk');

        next();
    } catch (error) {
        console.log(error)
        next(error);
    }
}