import ISubscribeRepository from "../../../core/repositories/SubscribeRepository/ISubscribeRepository";
import Subscription from "../../database/etities/Subscription";
import User from "../../database/etities/User";
import SubscribeMapper from "../../mappers/SubscribeMapper/SubscribeMapper";
import Subscribe from "../../../core/domain/models/Subscribe/Subscribe";

export default class SubscriptionRepositoryImpl implements  ISubscribeRepository {

    private readonly subscriptionMapper: SubscribeMapper = new SubscribeMapper();
    async createUserSubscription(userId: number, subscriptionId: string, validUntil: string): Promise<boolean> {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return false;
        }

        await Subscription.create({
            code: subscriptionId,
            validUntil: validUntil,
            userId: user.id
        });

        return true;
    }

    async getSubscriptionByUserId(userId: number): Promise<Subscribe | null> {
        const subscription = await Subscription.findOne({
            where: { userId },
            include: [User]
        });
        if (!subscription) {
            return null;
        }
        return this.subscriptionMapper.toDomainModel(subscription);
    }

    async setSubscribeValidTrue(subscribeId: number): Promise<Subscribe | null> {
        const subscription = await Subscription.findOne( { where: { id: subscribeId } });
        if (!subscription) {
            return null;
        }
        subscription.isValid = true;
        await subscription.save();
        return this.subscriptionMapper.toDomainModel(subscription);
    }

}