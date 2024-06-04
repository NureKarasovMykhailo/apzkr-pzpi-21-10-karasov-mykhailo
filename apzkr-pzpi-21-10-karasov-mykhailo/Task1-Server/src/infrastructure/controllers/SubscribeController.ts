import {NextFunction, Response, Request} from "express";
import Subscription from "../database/etities/Subscription";

export default class SubscribeController {
    async getSubscribeById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const subscribe =  await Subscription.findOne({where: {userId: id}});
            return res.status(200).json(subscribe);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}