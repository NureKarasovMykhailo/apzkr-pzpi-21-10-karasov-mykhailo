import IRoleRepository from "../../../core/repositories/RoleRepository/IRoleRepository";
import CreateRoleDto from "../../../core/repositories/RoleRepository/dto/CreateRoleDto";
import RoleDomainModel from "../../../core/domain/models/Role/Role";
import Role from "../../database/etities/Role";
import IMapper from "../../mappers/IMapper";
import MapperFabric from "../../mappers/MapperFabric";
import MappersEnum from "../../../core/common/enums/MappersEnum";

export default class RoleRepositoryImpl implements  IRoleRepository {

    private roleMapper: IMapper<any, any> = MapperFabric.getMapper(MappersEnum.RoleMapper);

    async createRole(dto: CreateRoleDto): Promise<RoleDomainModel> {
        const role: Role =  await Role.create({...dto});
        return this.roleMapper.toDomainModel(role);
    }

    async getRoleByTitle(roleTitle: string): Promise<RoleDomainModel | null> {
        const role = await Role.findOne({where: {roleTitle}});
        if (role) {
            return this.roleMapper.toDomainModel(role);
        } else {
            return null;
        }
    }

    async getAllRoles(): Promise<RoleDomainModel[]> {
        const roles = await Role.findAll();
        return roles.map(role => {
            return this.roleMapper.toDomainModel(role);
        });
    }

    async getRoleById(id: number): Promise<RoleDomainModel | null> {
        const role = await Role.findOne({where: {id}});
        if (role) {
            return this.roleMapper.toDomainModel(role);
        } else {
            return null;
        }
    }

    async updateRole(dto: CreateRoleDto, id: number): Promise<RoleDomainModel | null> {
        let role = await Role.findOne({where: { id }});
        if (role) {
            role.roleTitle = dto.roleTitle;
            role.description = dto.description;
            await role.save();
            return this.roleMapper.toDomainModel(role);
        } else {
            return null;
        }
    }

    async deleteRole(id: number): Promise<void> {
        const role = await Role.findOne({where: {id}});
        await role?.destroy();
        return;
    }
}