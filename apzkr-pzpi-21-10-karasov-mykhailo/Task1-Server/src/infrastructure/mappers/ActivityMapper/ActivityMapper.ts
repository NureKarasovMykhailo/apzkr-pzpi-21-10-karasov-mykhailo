import IMapper from "../IMapper";
import ActivityDomainModel from "../../../core/domain/models/Acitivity/Activity";
import Activity from "../../database/etities/Activity";
import EducationMapper from "../EducationMapper/EducationMapper";
import CompanyMapper from "../CompanyMapper/CompanyMapper";
import ComplexityMapper from "../ComplexityMapper/ComplexityMapper";
import UserMapper from "../UserMapper/UserMapper";
import UserDomainModel from "../../../core/domain/models/User/User";
import User from "../../database/etities/User";

export default class ActivityMapper implements IMapper<Activity, ActivityDomainModel> {
    private readonly educationMapper: EducationMapper = new EducationMapper();
    private readonly companyMapper: CompanyMapper = new CompanyMapper();
    private readonly complexityMapper: ComplexityMapper = new ComplexityMapper();
    private readonly userMapper: UserMapper = new UserMapper();

    toDomainModel(data: Activity): ActivityDomainModel {
        const educationDomain = data.education ? this.educationMapper.toDomainModel(data.education) : null;
        const complexityDomain = data.complexity ? this.complexityMapper.toDomainModel(data.complexity) : null;
        const companyDomain = data.company ? this.companyMapper.toDomainModel(data.company) : null;
        let users: UserDomainModel[] = [];

        if (data.users) {
            users = data.users.map(user => {
                return this.userMapper.toDomainModel(user);
            });
        }

        return new ActivityDomainModel(
            data.id,
            data.activityTitle,
            data.description,
            data.requiredWorkersCount,
            data.timeShift,
            data.complexityId,
            data.educationId,
            data.companyId,
            complexityDomain,
            educationDomain,
            companyDomain,
            users
        );
    }

    toPersistenceModel(data: ActivityDomainModel): Activity {
        const education = data.education ? this.educationMapper.toPersistenceModel(data.education) : null;
        const complexity = data.complexity ? this.complexityMapper.toPersistenceModel(data.complexity) : null;
        const company = data.company ? this.companyMapper.toPersistenceModel(data.company) : null;
        let users: User[] = [];

        if (data.users) {
            users = data.users.map(user => {
                return this.userMapper.toPersistenceModel(user);
            });
        }

        const activity = new Activity();
        activity.id = data.id;
        activity.activityTitle = data.activityTitle;
        activity.description = data.description;
        activity.requiredWorkersCount = data.requiredWorkerCount;
        activity.timeShift = data.timeShift;
        activity.complexityId = data.complexityId;
        activity.educationId = data.educationId
        activity.companyId = data.companyId;
        activity.education = education;
        activity.company = company;
        activity.complexity = complexity;
        activity.users = users;

        return activity;
    }

}