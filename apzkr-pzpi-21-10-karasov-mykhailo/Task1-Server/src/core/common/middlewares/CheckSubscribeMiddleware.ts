import {NextFunction, Response, Request} from "express";
import ISubscribeRepository from "../../repositories/SubscribeRepository/ISubscribeRepository";
import ApiError from "../error/ApiError";
import SubscriptionClass from "../uttils/SubscriptionClass";
import i18n from "i18n";

export default class CheckSubscribeMiddleware {
    constructor(
       private readonly subscriptionRepository: ISubscribeRepository
    ) {}

    async checkSubscribe(req: Request, res: Response, next: NextFunction) {

        // @ts-ignore
        const subscribe = await this.subscriptionRepository.getSubscriptionByUserId(req.user.id);
        if (!subscribe) {
            return next(ApiError.forbidden(i18n.__('youHaveToSubscribe')));
        }

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const validUntil = new Date(subscribe.validUntil);
        validUntil.setHours(0, 0, 0, 0);

        if (validUntil < currentDate) {
            return next(ApiError.forbidden(i18n.__('youHaveToSubscribe')));
        } else if (validUntil >= currentDate && !subscribe.isValid) {
            const subscriptionClass = new SubscriptionClass();
            if (await subscriptionClass.isSubscriptionValid(subscribe)) {
                await this.subscriptionRepository.setSubscribeValidTrue(subscribe.id);
                return next();
            } else {
                return next(ApiError.forbidden(i18n.__('youHaveToSubscribe')));
            }
        }

        return next();
    }
}