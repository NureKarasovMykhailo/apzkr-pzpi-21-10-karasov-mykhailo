import express from "express";
import TimeTableController from "../controllers/TimeTableController";
import hasUserCompanyMiddleware from "../../core/common/middlewares/HasUserCompanyMiddleware";
import authMiddleware from "../../core/common/middlewares/AuthMiddleware";
import TimeTableService from "../../core/services/TimeTableService/TimeTableService";
import UserRepositoryImpl from "../repositoriesImpl/sequelizeRepository/UserRepositoryImpl";
import ActivityRepositoryImpl from "../repositoriesImpl/sequelizeRepository/ActivityRepositoryImpl";
import ScannerHistoryRepositoryImpl from "../repositoriesImpl/sequelizeRepository/ScannerHistoryRepositoryImpl";

const router = express.Router();

const timeTableService = new TimeTableService(
    new UserRepositoryImpl(),
    new ActivityRepositoryImpl(),
    new ScannerHistoryRepositoryImpl()
);

const timeTableController = new TimeTableController(timeTableService);

router.get(
    '/:id',
    authMiddleware,
    //hasUserCompanyMiddleware,
    timeTableController.getWorkForEmployee.bind(timeTableController)
);

router.get(
    '/',
    authMiddleware,
    //hasUserCompanyMiddleware,
    timeTableController.getFullTimeTable.bind(timeTableController)
);

export default router;