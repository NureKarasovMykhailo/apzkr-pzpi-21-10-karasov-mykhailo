import IMapper from "../IMapper";
import Subscribe from "../../../core/domain/models/Subscribe/Subscribe";
import Subscription from "../../database/etities/Subscription";

export default class SubscribeMapper implements IMapper<Subscription, Subscribe> {

    toDomainModel(data: Subscription): Subscribe {

        return new Subscribe(
            data.id,
            data.code,
            data.validUntil,
            data.isValid,
            data.userId
        );
    }

    toPersistenceModel(data: Subscribe): Subscription {
        const subscription = new Subscription();
        subscription.id = data.id;
        subscription.code = data.code;
        subscription.validUntil = data.validUntil;
        subscription.isValid = data.isValid;
        subscription.userId = data.userId

        return subscription;
    }

}