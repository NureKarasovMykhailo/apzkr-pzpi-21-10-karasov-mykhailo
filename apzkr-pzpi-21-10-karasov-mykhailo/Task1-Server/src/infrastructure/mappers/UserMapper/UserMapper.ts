import IMapper from "../IMapper";
import UserDomainModel from "../../../core/domain/models/User/User";
import User from "../../database/etities/User";
import EducationMapper from "../EducationMapper/EducationMapper";
import EducationDomainModel from "../../../core/domain/models/Education/Education";
import RoleDomainModel from "../../../core/domain/models/Role/Role";
import RoleMapper from "../RoleMapper/RoleMapper";
import Role from "../../database/etities/Role";
import Education from "../../database/etities/Education";

export default class UserMapper implements IMapper<User, UserDomainModel> {
    private readonly educationMapper: EducationMapper = new EducationMapper();
    private readonly roleMapper: RoleMapper = new RoleMapper();

    toDomainModel(data: User): UserDomainModel {
        let education: EducationDomainModel[] = [];
        let roles: RoleDomainModel[] = [];

        if (data.educations) {
            education = data.educations.map(education => {
                return this.educationMapper.toDomainModel(education);
            })
        }

        if (data.roles) {
            roles = data.roles.map(role => {
                return this.roleMapper.toDomainModel(role);
            });
        }

        return new UserDomainModel(
            data.id,
            data.email,
            data.firstName,
            data.secondName,
            data.password,
            data.phoneNumber,
            data.birthday,
            data.userImage,
            data.companyId,
            roles,
            education,
        );
    }

    toPersistenceModel(data: UserDomainModel): User {
        let educations: Education[] = [];
        let roles: Role[] = [];

        if (data.educations) {
            educations = data.educations.map(education => {
                return this.educationMapper.toPersistenceModel(education);
            })
        }

        if (data.roles) {
            roles = data.roles.map(role => {
                return this.roleMapper.toPersistenceModel(role);
            });
        }

        const user = new User();

        user.id = data.id;
        user.userImage = data.userImage;
        user.birthday = data.birthday;
        user.phoneNumber = data.phoneNumber;
        user.password = data.password;
        user.secondName = data.secondName;
        user.firstName = data.firstName;
        user.email = data.email;
        user.companyId = data.companyId
        user.educations = educations;
        user.roles = roles;

        return user;
    }

}