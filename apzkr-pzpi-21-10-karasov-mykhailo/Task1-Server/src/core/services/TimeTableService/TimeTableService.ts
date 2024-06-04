import IUserRepository from "../../repositories/UserRepository/IUserRepository";
import IActivityRepository from "../../repositories/ActivityRepository/IActivityRepository";
import IScannerHistoryRepository from "../../repositories/ScannerHistoryRepository/IScannerHistoryRepository";
import ApiError from "../../common/error/ApiError";
import ScannerHistoryDomainModel from "../../domain/models/ScannerHistory/ScannerHistory";
import ActivityDomainModel from "../../domain/models/Acitivity/Activity";
import EducationDomainModel from "../../domain/models/Education/Education";
import TimeTableManager from "../../common/classes/TimeTableManager";
import i18n from "i18n";

export default class TimeTableService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly activityRepository: IActivityRepository,
        private readonly scannerHistoryRepository: IScannerHistoryRepository
    ) {}

    public async getWorkForEmployee(userId: number, companyId: number) {
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }

        if (user.companyId !== companyId) {
            throw ApiError.notFound(i18n.__('companyNotFound'));
        }

        if (!user.educations) {
            throw ApiError.badRequest(i18n.__('userHasNotEducation'))
        }

        let activities = await this.activityRepository.getActivityByCompanyId(companyId);
        const userScannerHistory = await this.scannerHistoryRepository.getScannerHistoryByUserId(userId);
        const lastScannerHistory = this.getLastUserScannerHistory(userScannerHistory);
        if (!lastScannerHistory) {
            throw ApiError.badRequest(i18n.__('thisUserHasNotScannerInfo'));
        }

        activities = this.getActivityWithRelevantEducation(activities, user.educations);
        activities = this.getActivityWithNotFullWorker(activities);

        const timeTableManager = new TimeTableManager(activities, lastScannerHistory);
        const optimalActivityId = timeTableManager.getOptimalActivity();

        return await this.activityRepository.addEmployee(optimalActivityId, userId);
    }

    public async createTimeTable(companyId: number) {
        const users = await this.userRepository.getUserByCompanyId(companyId);
        for (let i = 0; i < users.length; i++) {
            try {
                await this.getWorkForEmployee(users[i].id, companyId);
            } catch (error) {
                console.log(error);
            }
        }

        return this.activityRepository.getActivityByCompanyId(companyId);
    }


    private getLastUserScannerHistory(scannerHistories: ScannerHistoryDomainModel[]) {
        if (scannerHistories.length === 0) {
            return null;
        }

        scannerHistories.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return scannerHistories[0];
    }

    private getActivityWithNotFullWorker(activities: ActivityDomainModel[]) {
        if (activities.length === 0) {
            throw ApiError.badRequest(i18n.__('thereNoActivities'));
        }

        return activities.filter(activity => activity.users.length < activity.requiredWorkerCount );
    }

    private getActivityWithRelevantEducation(activities: ActivityDomainModel[], educations: EducationDomainModel[]) {
        if (activities.length === 0) {
            throw ApiError.badRequest(i18n.__('thereNoActivities'));
        }

        let filteredActivities: ActivityDomainModel[] = [];
        for (let i = 0; i < educations.length; i++) {
            for (let j = 0; j < activities.length; j++) {
                if (educations[i].educationTitle === activities[j].education?.educationTitle) {
                    filteredActivities.push(activities[j]);
                }
            }
        }

        return filteredActivities;
    }

}