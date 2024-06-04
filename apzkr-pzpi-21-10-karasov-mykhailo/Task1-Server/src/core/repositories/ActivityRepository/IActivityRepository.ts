import CreateOrUpdateActivityDto from "./dto/CreateOrUpdateActivityDto";
import ActivityDomainModel from "../../domain/models/Acitivity/Activity";

export default interface IActivityRepository {
    createActivity(dto: CreateOrUpdateActivityDto): Promise<ActivityDomainModel>;
    getActivityByCompanyId(id: number): Promise<ActivityDomainModel[]>;
    getActivityById(id: number): Promise<ActivityDomainModel | null>;
    updateActivity(id: number, dto: CreateOrUpdateActivityDto): Promise<ActivityDomainModel>;
    deleteActivityById(id: number): Promise<void>;
    addEmployee(id: number, userId: number): Promise<ActivityDomainModel>;
    deleteEmployee(id: number, userId: number): Promise<ActivityDomainModel>;
    getAllActivities(): Promise<ActivityDomainModel[]>;
}