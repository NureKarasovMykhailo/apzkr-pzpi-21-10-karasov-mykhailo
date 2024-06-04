import IActivityRepository from "../../../core/repositories/ActivityRepository/IActivityRepository";
import CreateOrUpdateActivityDto from "../../../core/repositories/ActivityRepository/dto/CreateOrUpdateActivityDto";
import ActivityDomainModel from "../../../core/domain/models/Acitivity/Activity";
import Activity from "../../database/etities/Activity";
import Complexity from "../../database/etities/Complexity";
import Education from "../../database/etities/Education";
import Company from "../../database/etities/Company";
import ApiError from "../../../core/common/error/ApiError";
import User from "../../database/etities/User";
import UserActivities from "../../database/etities/UserActivities";
import i18n from "i18n";
import IMapper from "../../mappers/IMapper";
import MapperFabric from "../../mappers/MapperFabric";
import MappersEnum from "../../../core/common/enums/MappersEnum";

export default class ActivityRepositoryImpl implements IActivityRepository{
    private activityMapper: IMapper<any, any> = MapperFabric.getMapper(MappersEnum.ActivityMapper);

    async createActivity(dto: CreateOrUpdateActivityDto): Promise<ActivityDomainModel> {
        const { company, complexity, education } = await this.checkDto(dto);

        const createdActivity = await Activity.create({
            activityTitle: dto.activityTitle,
            description: dto.description,
            requiredWorkersCount: dto.requiredWorkerCount,
            timeShift: dto.timeShift,
            complexityId: complexity.id,
            educationId: education.id,
            companyId: company.id
        });

        const activity = await Activity.findOne({
            where: {id: createdActivity.id},
            include: [Education, Complexity, Company, User]
        });


        if (!activity) {
            throw ApiError.notFound(i18n.__('activityNotFound'));
        }

        return this.activityMapper.toDomainModel(activity);
    }

    async getActivityByCompanyId(id: number): Promise<ActivityDomainModel[]> {
        const activities = await Activity.findAll({
            where: { companyId: id},
            include: [Education, Complexity, Company, User]
        });
        return activities.map(activity => {
            return this.activityMapper.toDomainModel(activity);
        });
    }

    async getActivityById(id: number): Promise<ActivityDomainModel | null> {
        const activity = await Activity.findOne({
            where: { id },
            include: [Education, Company, Complexity, User]
        });
        if (!activity) {
            return null;
        }
        return this.activityMapper.toDomainModel(activity);
    }

    async updateActivity(id: number, dto: CreateOrUpdateActivityDto): Promise<ActivityDomainModel> {
        const { company, complexity, education } = await this.checkDto(dto);

        const activity = await Activity.findOne({
            where: { id },
            include: [Education, Company, Complexity, User]
        });
        if (!activity) {
            throw ApiError.notFound(i18n.__('activityNotFound'));
        }

        activity.activityTitle = dto.activityTitle;
        activity.description = dto.description;
        activity.requiredWorkersCount = dto.requiredWorkerCount;
        activity.timeShift = dto.timeShift;
        activity.complexityId = dto.complexityId;
        activity.educationId = dto.educationId;
        activity.companyId = dto.companyId;
        activity.company = company;
        activity.education = education;
        activity.complexity = complexity;

        await activity.save();

        const updatedActivity = await this.getActivityById(id);
        if (!updatedActivity) {
            throw ApiError.notFound(i18n.__('activityNotFound'));
        }
        return updatedActivity;

    }

    async deleteActivityById(id: number): Promise<void> {
        const activity = await Activity.findOne({where: { id }});
        await activity?.destroy();
        return;
    }

    async addEmployee(id: number, userId: number): Promise<ActivityDomainModel> {
        if (await this.isUserInActivity(id, userId)) {
            throw ApiError.badRequest(i18n.__('userIsAlreadyInActivity'));
        }

        await UserActivities.create({
            userId: userId,
            activityId: id
        });

        const activity = await this.getActivityById(id);
        if (!activity) {
            throw ApiError.notFound(i18n.__('activityNotFound'));
        }
        return activity;
    }

    async deleteEmployee(id: number, userId: number): Promise<ActivityDomainModel> {
        const userActivity = await UserActivities.findOne({
            where: {activityId: id, userId: userId}
        });

        await userActivity?.destroy();
        const activity = await this.getActivityById(id);
        if (!activity) {
            throw ApiError.notFound(i18n.__('activityNotFound'));
        }
        return activity;
    }

    async getAllActivities(): Promise<ActivityDomainModel[]> {
        const activities = await Activity.findAll({
            include: [Education, Company, Complexity]
        });
        return activities.map(activity => {
            return this.activityMapper.toDomainModel(activity);
        });
    }


    private async checkDto(dto: CreateOrUpdateActivityDto) {
        const complexity = await Complexity.findOne({ where: { id: dto.complexityId }});
        const education = await Education.findOne({ where: { id: dto.educationId}});
        const company = await Company.findOne({ where: { id: dto.companyId }});

        if (!complexity || !education || !company) {
            throw ApiError.badRequest(i18n.__('errorWhileCreatingActivity'));
        }

        return { complexity, education, company }
    }

    private async isUserInActivity(activityId: number, userId: number) {
        const activity = await UserActivities.findOne({
            where: {activityId, userId}
        });

        return activity !== null;
    }


}