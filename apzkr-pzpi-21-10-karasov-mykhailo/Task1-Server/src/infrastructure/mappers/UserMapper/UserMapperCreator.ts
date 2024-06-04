import IMapperCreator from "../IMapperCreator";
import IMapper from "../IMapper";
import UserDomainModel from "../../../core/domain/models/User/User";
import UserMapper from "./UserMapper";
import User from "../../database/etities/User";

export default class UserMapperCreator implements IMapperCreator<User, UserDomainModel> {
    createMapper(): IMapper<User, UserDomainModel> {
        return new UserMapper();
    }

}