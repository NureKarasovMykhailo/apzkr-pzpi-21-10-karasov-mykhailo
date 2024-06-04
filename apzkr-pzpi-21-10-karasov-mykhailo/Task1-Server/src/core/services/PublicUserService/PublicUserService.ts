import FileManager from "../../common/uttils/FileManager";
import IUserRepository from "../../repositories/UserRepository/IUserRepository";
import UpdateUserPublicDto from "../../repositories/UserRepository/dto/UpdateUserPublicDto";
import ApiError from "../../common/error/ApiError";
import {DEFAULT_USER_IMAGE_NAME} from "../../../config";
import AddOrDeleteEducationDto from "../../repositories/UserRepository/dto/AddOrDeleteEducationDto";
import SubscriptionClass from "../../common/uttils/SubscriptionClass";
import ISubscribeRepository from "../../repositories/SubscribeRepository/ISubscribeRepository";
import RolesEnum from "../../common/enums/RolesEnum";
import AddOrDeleteRoleDto from "../../repositories/UserRepository/dto/AddOrDeleteRoleDto";
import JWT from "../../common/uttils/JWT";
import RoleDomainModel from "../../domain/models/Role/Role";
import i18n from "i18n"

export default class PublicUserService {

    private readonly fileManger = new FileManager();

    constructor(
       private readonly userRepository: IUserRepository,
       private readonly subscriptionRepository: ISubscribeRepository,
    ) {}

    public async updateUser(userId: number, dto: UpdateUserPublicDto): Promise<string> {
        const user = await this.userRepository.getUserById(userId);
        if (!user ) {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }
        let fileName =  user.userImage
        if (dto.userImage) {
            if (user.userImage !== DEFAULT_USER_IMAGE_NAME) {
                await this.fileManger.deleteFile(user.userImage);
            }
            fileName = await this.fileManger.createFile(dto.userImage);
        }

        const updatingUser = await this.userRepository.updateUserPublic(userId, dto, fileName);

        if (!updatingUser) {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }
        const roles = await this.userRepository.getUserRoles(updatingUser.id);

        const jwt = new JWT(updatingUser, roles);
        return jwt.generateJwt();
    }

    public async addEducation(userId: number, dto: AddOrDeleteEducationDto): Promise<string> {
        const user = await this.userRepository.addEducation(userId, dto);
        if (!user) {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }
        const roles = await this.userRepository.getUserRoles(user.id);
        const jwt = new JWT(user, roles);
        return jwt.generateJwt();
    }

    public async deleteEducation(userId: number, dto: AddOrDeleteEducationDto): Promise<string> {
        const user = await this.userRepository.deleteEducation(userId, dto);
        if (!user) {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }
        const roles = await this.userRepository.getUserRoles(user.id);
        const jwt = new JWT(user, roles);
        return jwt.generateJwt();
    }

    public async subscribe(userId: number) {
        const subscriptionClass: SubscriptionClass = new SubscriptionClass();
        const response = await subscriptionClass.subscribeRequest();

        if (response.ok) {
            const currentDate = new Date();
            const validUntilDate = new Date(currentDate.getTime() + 31 * 24 * 60 * 60 * 1000);
            const subscriptionDetails = await response.json();
            const subscriptionId = subscriptionDetails.id;
            if (await this.subscriptionRepository.getSubscriptionByUserId(userId) === null) {
                await this.subscriptionRepository.createUserSubscription(userId, subscriptionId, validUntilDate.toISOString());
            }
            const dto: AddOrDeleteRoleDto = new AddOrDeleteRoleDto(RolesEnum.SUBSCRIBER);
            const user = await this.userRepository.getUserById(userId);
            if (user && !this.isUserHasRoleSubscriber(user.roles)) {
                await this.userRepository.addUserRole(dto, userId);
            }
            return subscriptionDetails;
        } else {
            throw ApiError.internalServerError(i18n.__('errorWithPayPalAPI'));
        }
    }

    public async getUserInfo(id: number) {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw ApiError.badRequest(`There no user with Id: ${id}`);
        }

        return user;
    }


    private isUserHasRoleSubscriber(roles: RoleDomainModel[] | null) {
        if (!roles) {
            throw ApiError.internalServerError(i18n.__('unknownError'));
        }
        let isSubscriber = false;
        roles.map(role => {
            if (role.roleTitle === RolesEnum.SUBSCRIBER) {
                isSubscriber = true;
            }
        });
        return isSubscriber;
    }

}