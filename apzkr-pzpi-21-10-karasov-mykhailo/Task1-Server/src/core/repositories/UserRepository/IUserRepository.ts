import UserDomainModel from "../../domain/models/User/User";
import CreateUserDto from "./dto/CreateUserDto";
import UpdateUserAdminDto from "./dto/UpdateUserAdminDto";
import AddOrDeleteRoleDto from "./dto/AddOrDeleteRoleDto";
import UpdateUserPublicDto from "./dto/UpdateUserPublicDto";
import AddOrDeleteEducationDto from "./dto/AddOrDeleteEducationDto";
import RoleDomainModel from "../../domain/models/Role/Role";
import EducationDomainModel from "../../domain/models/Education/Education";

export default interface IUserRepository {
    getUserByEmail(email: string): Promise<UserDomainModel | null>;
    createUser(dto: CreateUserDto, userImage: string, hashPassword: string): Promise<UserDomainModel>;
    getUsersByRole(roleTitle: string): Promise<UserDomainModel[]>;
    getAllUsers(): Promise<UserDomainModel[]>;
    getUserById(id: number): Promise<UserDomainModel | null>;
    updateUser(id: number, dto: UpdateUserAdminDto, userImage: string): Promise<UserDomainModel | null>;
    deleteUserById(id: number): Promise<void>;
    addUserRole(dto: AddOrDeleteRoleDto, userId: number): Promise<UserDomainModel | null>;
    deleteUserRole(dto: AddOrDeleteRoleDto, userId: number): Promise<UserDomainModel | null>;
    updateUserPublic(id: number, dto: UpdateUserPublicDto, fileName: string): Promise<UserDomainModel | null>;
    addEducation(id: number, dto: AddOrDeleteEducationDto): Promise<UserDomainModel | null>;
    deleteEducation(id: number, dto: AddOrDeleteEducationDto): Promise<UserDomainModel | null>;
    setCompanyId(userId: number, companyId: number): Promise<UserDomainModel | null>;
    getUserRoles(userId: number): Promise<RoleDomainModel[]>;
    unpinUserFromCompany(userId: number): Promise<UserDomainModel | null>;
    getUserEducations(userId: number): Promise<EducationDomainModel[]>;
    getUserByCompanyId(companyId: number): Promise<UserDomainModel[]>
    getUserWithoutCompany(): Promise<UserDomainModel[]>;
}