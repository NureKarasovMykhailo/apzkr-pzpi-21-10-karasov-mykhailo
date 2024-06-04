import IUserRepository from "../../repositories/UserRepository/IUserRepository";
import CreateUserDto from "../../repositories/UserRepository/dto/CreateUserDto";
import UserDomainModel from "../../domain/models/User/User";
import ApiError from "../../common/error/ApiError";
import {DEFAULT_USER_IMAGE_NAME} from "../../../config";
import FileManager from "../../common/uttils/FileManager";
import bcrypt from "bcrypt";
import PaginationClass from "../../common/uttils/PaginationClass";
import UpdateUserAdminDto from "../../repositories/UserRepository/dto/UpdateUserAdminDto";
import AddOrDeleteRoleDto from "../../repositories/UserRepository/dto/AddOrDeleteRoleDto";
import UserRole from "../../common/enums/RolesEnum";
import RolesEnum from "../../common/enums/RolesEnum";
import i18n from "i18n";

export default class AdminUserService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly fileManager: FileManager
    ) {}

    public async createUser(dto: CreateUserDto): Promise<UserDomainModel> {
        if (await this.isUserWithEmailExits(dto.email)) {
            throw ApiError.conflict(i18n.__('userWithThisEmailExisted'));
        }
        let fileName: string = DEFAULT_USER_IMAGE_NAME;
        if (dto.userImage !== DEFAULT_USER_IMAGE_NAME) {
            fileName = await this.fileManager.createFile(dto.userImage);
        }
        const hashedPassword = bcrypt.hashSync(dto.password, 5);

        return await this.userRepository.createUser(dto, fileName, hashedPassword);
    }

    public async getAllUsers(
        roleTitle: string,
        email: string,
        sortBy: string,
        offset: number,
        limit: number) {
        let users: UserDomainModel[] = [];
        if (email) {
            const user = await this.userRepository.getUserByEmail(email);
            if (user) {
                users.push(user);
            }
        }

        if (roleTitle) {
            users = await this.userRepository.getUsersByRole(roleTitle);
        }

        if (!roleTitle && !email) {
            users = await this.userRepository.getAllUsers();
        }

        if (sortBy) {
            if (sortBy ===  'asc') {
                users.sort((a, b) => a.secondName.localeCompare(b.secondName));
            } else if (sortBy === 'desc') {
                users.sort((a, b) => b.secondName.localeCompare(a.secondName));
            }
        }

        const pagination: PaginationClass<UserDomainModel> = new PaginationClass();
        console.log(offset);
        const paginatedUser = pagination.paginateItems(users, offset, limit);
        return paginatedUser;
    }

    public async getUserById(id: number) {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }
        const roles = await this.userRepository.getUserRoles(id);
        const educations = await this.userRepository.getUserEducations(id);
        return { user, roles, educations};
    }

    public async updateUser(id: number, dto: UpdateUserAdminDto): Promise<UserDomainModel> {
        console.log(`Id: ${id}`)
        const user = await this.userRepository.getUserById(id);

        if (!user) {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }

        if (await this.isUserWithEmailExits(dto.email) && dto.email !== user.email) {
            throw ApiError.conflict(i18n.__('userWithThisEmailExisted'));
        }

        let fileName: string;
        if (dto.userImage !== DEFAULT_USER_IMAGE_NAME) {
            if (user.userImage !== DEFAULT_USER_IMAGE_NAME) {
                await this.fileManager.deleteFile(user.userImage);
            }
            fileName = await this.fileManager.createFile(dto.userImage);
        } else {
            fileName = user.userImage;
        }

        const updatedUser = await this.userRepository.updateUser(id, dto, fileName);
        if (!updatedUser) {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }
        return updatedUser;
    }

    async deleteUserById(id: number): Promise<void> {
        const deletedUser = await this.userRepository.getUserById(id);
        if (deletedUser) {
            if (deletedUser.userImage !== DEFAULT_USER_IMAGE_NAME) {
                await this.fileManager.deleteFile(deletedUser.userImage);
            }
            await this.userRepository.deleteUserById(id);
        }

        return;
    }

    async addUserRole(id: number, dto: AddOrDeleteRoleDto, addingUserRoles: string[]) {

        if ((addingUserRoles.includes(RolesEnum.COMPANY_ADMIN) || addingUserRoles.includes(RolesEnum.SUBSCRIBER))
            && (dto.roleTitle === RolesEnum.SUBSCRIBER || dto.roleTitle === RolesEnum.ADMIN)) {
            throw ApiError.forbidden(i18n.__('youCannotAddThisRole'))
        }

        const user =  await this.userRepository.addUserRole(dto, id);
        if (!user) {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }
        const roles = await this.userRepository.getUserRoles(id);
        return {user, roles};
    }

    public async deleteUserRole(dto: AddOrDeleteRoleDto, userId: number, addingUserRoles: string[]) {
        console.log(addingUserRoles)
        if ((addingUserRoles.includes(RolesEnum.COMPANY_ADMIN) || addingUserRoles.includes(RolesEnum.SUBSCRIBER) && !addingUserRoles.includes(RolesEnum.ADMIN))
            && (dto.roleTitle === RolesEnum.SUBSCRIBER || dto.roleTitle === RolesEnum.ADMIN)) {
            throw ApiError.forbidden(i18n.__('youCannotDeleteThisRole'))
        }

        if (dto.roleTitle === UserRole.USER) {
            throw ApiError.forbidden(i18n.__('youCannotDeleteThisRole'));
        }
        const user = await this.userRepository.deleteUserRole(dto, userId);
        if (!user) {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }
        const roles = await this.userRepository.getUserRoles(userId);
        return {user, roles};
    }

    private async isUserWithEmailExits(email: string): Promise<boolean> {
        const candidate: UserDomainModel | null = await this.userRepository.getUserByEmail(email);
        return candidate !== null;
    }
}