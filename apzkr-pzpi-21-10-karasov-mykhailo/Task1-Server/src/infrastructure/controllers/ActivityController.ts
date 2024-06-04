import ActivityService from "../../core/services/ActivityService/ActivityService";
import {NextFunction, Response, Request} from "express";
import CreateOrUpdateActivityDto from "../../core/repositories/ActivityRepository/dto/CreateOrUpdateActivityDto";
import {validationResult} from "express-validator";
import formatValidationErrors from "../../core/common/uttils/ValidationErrorsUttils";
import ApiError from "../../core/common/error/ApiError";
import IMapper from "../mappers/IMapper";

export default class ActivityController {
    constructor(
       private readonly activityService: ActivityService,
       private readonly activityMapper: IMapper<any, any>
    ) {}

    public async createActivity(req: Request, res: Response, next: NextFunction) {
        try {
            let companyId;
            if (req.user.companyId) {
                companyId = req.user.companyId;
            } else {
                companyId = req.body.companyId;
            }

            const {
                activityTitle,
                description,
                requiredWorkerCount,
                timeShift,
                complexityId,
                educationId,
            } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = formatValidationErrors(errors.array());
                return next(ApiError.badRequest(errorMessages.join(', ')));
            }

            const dto: CreateOrUpdateActivityDto = new CreateOrUpdateActivityDto(
                activityTitle,
                description,
                requiredWorkerCount,
                timeShift,
                complexityId,
                educationId,
                companyId
            );
            const activityDomain = await this.activityService.createActivity(dto);
            const activityPersistence = this.activityMapper.toPersistenceModel(activityDomain);
            console.log(activityPersistence)
            return res.status(201).json({
                activity: activityDomain
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getActivities(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user.companyId) {
                const {
                    educationTitle,
                    activityTitle,
                    sortBy,
                    page = '1',
                    limit = '10'
                } = req.query;

                const offset: number = Number(page) * Number(limit) - Number(limit);
                const activities = await this.activityService.getActivityOfCompany(
                    req.user.companyId,
                    activityTitle as string,
                    educationTitle as string,
                    sortBy as string,
                    offset,
                    Number(limit)
                );

                return res.status(200).json({
                    activities: activities.paginatedItems,
                    pagination: {
                        totalItems: activities.itemsCount,
                        totalPages: activities.totalPages,
                        currentPage: page,
                        itemsPerPage: limit
                    }
                });

            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getActivityById(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user.companyId) {
                const { id } = req.params;
                const activity = await this.activityService.getActivityById(Number(id), req.user.companyId);
                return res.status(200).json({ activity: activity});
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async updateActivity(req: Request, res: Response, next: NextFunction) {
        try {
            let companyId;
            if (req.user.companyId) {
                companyId = req.user.companyId;
            } else {
                companyId = req.body.companyId;
            }

            const { id } = req.params;
            const {
                activityTitle,
                description,
                requiredWorkerCount,
                timeShift,
                complexityId,
                educationId
            } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = formatValidationErrors(errors.array());
                return next(ApiError.badRequest(errorMessages.join(', ')));
            }

            const dto: CreateOrUpdateActivityDto = new CreateOrUpdateActivityDto(
                activityTitle as string,
                description as string,
                Number(requiredWorkerCount),
                Number(timeShift),
                Number(complexityId),
                Number(educationId),
                companyId
            );
            
            const updatedActivity = await this.activityService.updateActivity(Number(id), companyId, dto);

            return res.status(200).json({ activity: updatedActivity });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async deleteActivity(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user.companyId) {
                const { id } = req.params;
                await this.activityService.deleteActivity(Number(id), req.user.companyId);
                return res.status(200).json({});
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async addEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user.companyId) {
                const { id } = req.params;
                const { userId } = req.body;

                const activity = await this.activityService.addEmployee(Number(id), Number(userId));

                return res.status(200).json({ activity: activity });
            }

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async deleteEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user.companyId) {
                const { id } = req.params;
                const { userId} = req.body;

                const activity = await this.activityService.deleteEmployee(Number(id), Number(userId));
                return res.status(200).json({ activity: activity});
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}