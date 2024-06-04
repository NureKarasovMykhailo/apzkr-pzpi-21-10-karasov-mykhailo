import ActivityService from "../../core/services/ActivityService/ActivityService";
import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import formatValidationErrors from "../../core/common/uttils/ValidationErrorsUttils";
import ApiError from "../../core/common/error/ApiError";
import CreateOrUpdateActivityDto from "../../core/repositories/ActivityRepository/dto/CreateOrUpdateActivityDto";

export default class AdminActivityController {
    constructor(
        private readonly activityService: ActivityService
    ) {}

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = formatValidationErrors(errors.array());
                return next(ApiError.badRequest(errorMessages.join(', ')));
            }

            const dto = this.getCreateOrUpdateActivityDto(req);
            const activityDomain = await this.activityService.createActivity(dto);

            return res.status(201).json({activity: activityDomain});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                activityTile,
                educationTitle,
                sortBy,
                limit = '8',
                page = '1'
            } = req.query;

            const offset = Number(page) * Number(limit) - Number(limit);

            const activities = await this.activityService.getActivities(
                activityTile as string,
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
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getActivityById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const activity = await this.activityService.getActivity(Number(id));

            return res.status(200).json({ activity });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = formatValidationErrors(errors.array());
                return next(ApiError.badRequest(errorMessages.join(', ')));
            }
            const dto = this.getCreateOrUpdateActivityDto(req);
            const updatedActivity = await this.activityService.updateActivityAdmin(Number(id), dto);
            return res.status(200).json({ activity: updatedActivity});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await this.activityService.deleteActivityAdmin(Number(id));
            return res.status(200).json({ });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    private getCreateOrUpdateActivityDto(req: Request) {

        const {
            activityTitle,
            description,
            requiredWorkerCount,
            timeShift,
            complexityId,
            educationId,
            companyId
        } = req.body;


        return new CreateOrUpdateActivityDto(
            activityTitle,
            description,
            requiredWorkerCount,
            timeShift,
            complexityId,
            educationId,
            companyId
        );
    }

    public async addEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { userId } = req.body;

            const activity = await this.activityService.addEmployee(Number(id), Number(userId));

            return res.status(200).json({activity});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async deleteEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { userId } = req.body;

            const activity = await this.activityService.deleteEmployee(Number(id), Number(userId));

            return res.status(200).json({activity});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}