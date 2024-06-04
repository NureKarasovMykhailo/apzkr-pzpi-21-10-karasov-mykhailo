import CreateRoleDto from "./dto/CreateRoleDto";
import Role from "../../domain/models/Role/Role";
import RoleDomainModel from "../../domain/models/Role/Role";

export default interface IRoleRepository {
    createRole(dto: CreateRoleDto): Promise<RoleDomainModel>;
    getRoleByTitle(roleTitle: string): Promise<RoleDomainModel | null>;
    getAllRoles(): Promise<RoleDomainModel[]>;
    getRoleById(id: number): Promise<RoleDomainModel | null>;
    updateRole(dto: CreateRoleDto, id: number): Promise<RoleDomainModel | null>;
    deleteRole(id: number): Promise<void>;
}