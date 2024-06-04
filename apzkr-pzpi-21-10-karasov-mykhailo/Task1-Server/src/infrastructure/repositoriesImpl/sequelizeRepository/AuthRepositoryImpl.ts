import {IAuthRepository} from "../../../core/repositories/AuthRepository/IAuthRepository";
import UserDomainModel from "../../../core/domain/models/User/User";
import {RegistrationDto} from "../../../core/repositories/AuthRepository/dto/RegistrationDto";
import User from "../../database/etities/User";
import Role from "../../database/etities/Role";
import RolesEnum from "../../../core/common/enums/RolesEnum";
import UserRoles from "../../database/etities/UserRoles";
import Education from "../../database/etities/Education";
import IMapper from "../../mappers/IMapper";

export default class AuthRepositoryImpl implements IAuthRepository {
    constructor(private readonly userMapper: IMapper<any, any>) {}

    async getUserByEmail(email: string): Promise<UserDomainModel | null> {
        const user: User | null = await User.findOne(
            {where: {email},
            include: [Role, Education]}
            );
        if (!user) {
            return null;
        }
        return this.userMapper.toDomainModel(user);
    }

    async userRegistration(dto: RegistrationDto): Promise<UserDomainModel> {
        const user =  await User.create({...dto});
        user.roles = [];
        const userRole = await Role.findOne({where: {roleTitle: RolesEnum.USER}});
        console.log(userRole);
        if (userRole != null) {
            user.roles.push(userRole);
            await UserRoles.create({
                userId: user.id,
                roleId: userRole.id
            });
        }
        await user.save();

        return this.userMapper.toDomainModel(user);
    }

}