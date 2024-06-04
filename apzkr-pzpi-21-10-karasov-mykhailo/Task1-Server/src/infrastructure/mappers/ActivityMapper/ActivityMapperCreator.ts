import IMapperCreator from "../IMapperCreator";
import Activity from "../../database/etities/Activity";
import ActivityDomainModel from "../../../core/domain/models/Acitivity/Activity";
import IMapper from "../IMapper";
import ActivityMapper from "./ActivityMapper";

export default class ActivityMapperCreator implements IMapperCreator<Activity, ActivityDomainModel> {
    createMapper(): IMapper<Activity, ActivityDomainModel> {
        return new ActivityMapper();
    }

}