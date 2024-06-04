import Subscription from "../../../infrastructure/database/etities/Subscription";
import Subscribe from "../../domain/models/Subscribe/Subscribe";

export default interface ISubscribeRepository {
    createUserSubscription(userId: number, subscriptionId: string, validUntil: string): Promise<boolean>;
    getSubscriptionByUserId(userId: number): Promise<Subscribe | null>;
    setSubscribeValidTrue(subscribeId: number): Promise<Subscribe | null>;
}