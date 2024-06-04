import AdminUserService from "../../core/services/AdminUserService/AdminUserService";
import User from "../database/etities/User";
import {NextFunction, Request, Response} from "express";
import CreateUserDto from "../../core/repositories/UserRepository/dto/CreateUserDto";
import {DEFAULT_USER_IMAGE_NAME} from "../../config";
import UserDomainModel from "../../core/domain/models/User/User";
import UpdateUserAdminDto from "../../core/repositories/UserRepository/dto/UpdateUserAdminDto";
import AddOrDeleteRoleDto from "../../core/repositories/UserRepository/dto/AddOrDeleteRoleDto";
import PublicUserService from "../../core/services/PublicUserService/PublicUserService";
import AddOrDeleteEducationDto from "../../core/repositories/UserRepository/dto/AddOrDeleteEducationDto";
import RoleDomainModel from "../../core/domain/models/Role/Role";
import EducationDomainModel from "../../core/domain/models/Education/Education";
import {validationResult} from "express-validator";
import formatValidationErrors from "../../core/common/uttils/ValidationErrorsUttils";
import ApiError from "../../core/common/error/ApiError";
import MapperFabric from "../mappers/MapperFabric";
import MappersEnum from "../../core/common/enums/MappersEnum";
import IMapper from "../mappers/IMapper";

class AdminUserController {
    private readonly userMapper: IMapper<any, any> = MapperFabric.getMapper(MappersEnum.UserMapper);

    constructor(
        private readonly userService: AdminUserService,
        private readonly publicUserService: PublicUserService,
        private readonly roleMapper: IMapper<any, any>,
        private readonly educationMapper: IMapper<any, any>
    ) {}


    public async createUser(req: Request, res: Response, next: NextFunction) {
        try {

            const {
                email,
                firstName,
                secondName,
                password,
                birthday,
                phoneNumber,
                companyId
            } = req.body;

            let userImage;

            if (req.files) {
                userImage = req.files.userImage;
            }


            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = formatValidationErrors(errors.array());
                return next(ApiError.badRequest(errorMessages.join(', ')));
            }

            const dto: CreateUserDto = new CreateUserDto(
                email,
                firstName,
                secondName,
                password,
                birthday,
                phoneNumber,
                userImage || DEFAULT_USER_IMAGE_NAME,
                companyId as number
            );

            const userDomainModel: UserDomainModel = await this.userService.createUser(dto);
            const user: User = this.userMapper.toPersistenceModel(userDomainModel);

            return res.status(201).json({user: user});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                roleTitle,
                email,
                limit = '10',
                page = '1' ,
                sortBy
            } = req.query;

            const offset: number = Number(page) * Number(limit) - Number(limit);

            const paginatedUserModel = await this.userService.getAllUsers(
                roleTitle as string,
                email as string,
                sortBy as string,
                offset,
                Number(limit),
            );

            const users = paginatedUserModel.items.map(userDomainModel => {
                return this.userMapper.toPersistenceModel(userDomainModel);
            });



            return res.status(200).json({
                users: paginatedUserModel.paginatedItems,
                pagination: {
                    totalItems: paginatedUserModel.itemsCount,
                    totalPages: paginatedUserModel.totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            });

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const {user, roles, educations}  = await this.userService.getUserById(Number(id));
            const { userPersistence, rolesPersistence, educationsPersistence}
                = this.mapUserWithRolesAndEducation(user, roles, educations);

            return res.status(200).json({ user: userPersistence, role: rolesPersistence, educations: educationsPersistence});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const {
                email,
                firstName,
                secondName,
                birthday,
                phoneNumber,
                companyId
            } = req.body;

            let userImage;

            if (req.files) {
                userImage = req.files.userImage;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = formatValidationErrors(errors.array());
                return next(ApiError.badRequest(errorMessages.join(', ')));
            }

            const dto: UpdateUserAdminDto = new UpdateUserAdminDto(
                email,
                firstName,
                secondName,
                birthday,
                phoneNumber,
                userImage || DEFAULT_USER_IMAGE_NAME,
                companyId as number
            );

            const updatedUserDomain = await this.userService.updateUser(Number(id), dto);
            const user = this.userMapper.toPersistenceModel(updatedUserDomain);

            return res.status(200).json({ user: user });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await this.userService.deleteUserById(Number(id));
            return res.status(200).json({});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async addRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { roleTitle } = req.body;
            const dto: AddOrDeleteRoleDto = new AddOrDeleteRoleDto(roleTitle);

            const userRoles = this.getUserRoles(req.user.roles);
            const {user, roles} = await this.userService.addUserRole(Number(id), dto, userRoles);
            const userPersistence = this.userMapper.toPersistenceModel(user);
            const rolesPersistence = roles.map(role => {
                return this.roleMapper.toPersistenceModel(role);
            })
            return res.status(200).json({ user: userPersistence, roles: rolesPersistence});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async deleteRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { roleTitle } = req.body;

            const dto: AddOrDeleteRoleDto = new AddOrDeleteRoleDto(roleTitle);
            // @ts-ignore
            const userRoles = this.getUserRoles(req.user.roles);

            const {user, roles} = await this.userService.deleteUserRole(dto, Number(id), userRoles);
            const userPersistence = this.userMapper.toPersistenceModel(user);
            const rolesPersistence = roles.map(role => {
                return this.roleMapper.toPersistenceModel(role);
            });
            return res.status(200).json({ user: userPersistence, roles: rolesPersistence});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async addEducation(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { educationTitle } = req.body;
            const dto: AddOrDeleteEducationDto = new AddOrDeleteEducationDto(educationTitle);

            await this.publicUserService.addEducation(Number(id), dto);
            const {user, roles, educations}  = await this.userService.getUserById(Number(id));
            const { userPersistence, rolesPersistence, educationsPersistence}
                = this.mapUserWithRolesAndEducation(user, roles, educations);

            return res.status(200).json({ user: userPersistence, role: rolesPersistence, educations: educationsPersistence});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async deleteEducation(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { educationTitle } = req.body;
            const dto: AddOrDeleteEducationDto = new AddOrDeleteEducationDto(educationTitle);

            await this.publicUserService.deleteEducation(Number(id), dto);
            const {user, roles, educations}  = await this.userService.getUserById(Number(id));
            const { userPersistence, rolesPersistence, educationsPersistence}
                = this.mapUserWithRolesAndEducation(user, roles, educations);

            return res.status(200).json({ user: userPersistence, role: rolesPersistence, educations: educationsPersistence});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    private getUserRoles(userRoles: RoleDomainModel[]): string[] {
        let roles: string[] = [];
        userRoles.map(role => {
            roles.push(role.roleTitle);
        });
        return roles;
    }

    private mapUserWithRolesAndEducation(user: UserDomainModel, roles: RoleDomainModel[], educations: EducationDomainModel[]){
        const userPersistenceModel = this.userMapper.toPersistenceModel(user);
        const rolesPersistence = roles.map(role => {
            return this.roleMapper.toPersistenceModel(role);
        });
        const educationsPersistenceModel = educations.map(education => {
            return this.educationMapper.toPersistenceModel(education);
        });

        return {
            userPersistence: userPersistenceModel,
            rolesPersistence: rolesPersistence,
            educationsPersistence: educationsPersistenceModel
        }
    }
}

export default AdminUserController;