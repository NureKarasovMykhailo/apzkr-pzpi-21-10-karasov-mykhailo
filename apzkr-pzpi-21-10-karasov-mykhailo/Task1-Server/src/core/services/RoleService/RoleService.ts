import CreateRoleDto from "../../repositories/RoleRepository/dto/CreateRoleDto";
import IRoleRepository from "../../repositories/RoleRepository/IRoleRepository";
import RoleDomainModel from "../../domain/models/Role/Role";
import ApiError from "../../common/error/ApiError";
import PaginationClass from "../../common/uttils/PaginationClass";
import i18n from "i18n";

export default class RoleService {

    constructor(readonly roleRepository: IRoleRepository) {}

    public async createRole(dto: CreateRoleDto) {
        if (await this.isRoleExist(dto.roleTitle)) {
            throw ApiError.conflict(i18n.__('roleWithThisTitleAlreadyExist'));
        }

        return await this.roleRepository.createRole(dto);
    }

    public async getAll(offset: number, limit: number) {
        const roles = await this.roleRepository.getAllRoles();
        const pagination: PaginationClass<RoleDomainModel> = new PaginationClass();
        return pagination.paginateItems(roles, offset, limit);
    }

    public async getOne(id: number) {
        const role = await this.roleRepository.getRoleById(id);
        if (!role) {
            throw ApiError.notFound(i18n.__('roleNotFound'));
        }
        return role;
    }

    public async updateRole(dto: CreateRoleDto, id: number) {
        const role: RoleDomainModel | null = await this.roleRepository.getRoleById(id);
        if (!role) {
            throw ApiError.notFound(i18n.__('roleNotFound'));
        }
        if (await this.isRoleExist(dto.roleTitle) && dto.roleTitle !== role.roleTitle) {
            throw ApiError.conflict(i18n.__('roleWithThisTitleAlreadyExist'))
        }
        const updatedRole =  await this.roleRepository.updateRole(dto, id);
        if (!updatedRole) {
            throw ApiError.notFound(i18n.__('roleNotFound'));
        }
        return updatedRole;
    }

    public async deleteRole(id: number) {
        await this.roleRepository.deleteRole(id);
    }

    private async isRoleExist(roleTitle: string): Promise<boolean> {
        const role: RoleDomainModel | null = await this.roleRepository.getRoleByTitle(roleTitle);
        return role !== null;
    }

}