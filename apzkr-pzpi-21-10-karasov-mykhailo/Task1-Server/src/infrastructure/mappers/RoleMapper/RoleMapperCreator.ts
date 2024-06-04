import IMapperCreator from "../IMapperCreator";
import IMapper from "../IMapper";
import Role from "../../database/etities/Role";
import RoleDomainModel from "../../../core/domain/models/Role/Role";
import RoleMapper from "./RoleMapper";

export default class RoleMapperCreator implements IMapperCreator<Role, RoleDomainModel> {
    createMapper(): IMapper<Role, RoleDomainModel> {
        return new RoleMapper();
    }

}