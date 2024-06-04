import {Request, NextFunction, Response} from "express";
import TimeTableService from "../../core/services/TimeTableService/TimeTableService";

export default class TimeTableController {
    constructor(
        private readonly timeTableService: TimeTableService
    ) {}

    public async getWorkForEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            if (req.user.companyId) {
                const activity = await this.timeTableService.getWorkForEmployee(Number(id), req.user.companyId);
                return res.status(200).json({activity});
            }

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getFullTimeTable(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user.companyId) {
                const activities = await this.timeTableService.createTimeTable(req.user.companyId);
                return res.status(200).json({activities});
            }

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

}