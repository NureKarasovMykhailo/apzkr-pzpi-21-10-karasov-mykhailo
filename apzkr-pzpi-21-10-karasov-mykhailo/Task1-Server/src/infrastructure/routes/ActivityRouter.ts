import express from "express";
import checkRoleMiddleware from "../../core/common/middlewares/CheckRoleMiddleware";
import RolesEnum from "../../core/common/enums/RolesEnum";
import hasUserCompanyMiddleware from "../../core/common/middlewares/HasUserCompanyMiddleware";
import createOrUpdateActivityValidator from "../../core/common/validators/CreateOrUpdateActivityValidator";
import ActivityController from "../controllers/ActivityController";
import ActivityService from "../../core/services/ActivityService/ActivityService";
import ActivityRepositoryImpl from "../repositoriesImpl/sequelizeRepository/ActivityRepositoryImpl";
import authMiddleware from "../../core/common/middlewares/AuthMiddleware";
import UserRepositoryImpl from "../repositoriesImpl/sequelizeRepository/UserRepositoryImpl";
import MapperFabric from "../mappers/MapperFabric";
import MappersEnum from "../../core/common/enums/MappersEnum";

const router = express.Router();

const activityService = new ActivityService(new ActivityRepositoryImpl(), new UserRepositoryImpl());
const activityController = new ActivityController(activityService, MapperFabric.getMapper(MappersEnum.ActivityMapper));

router.post(
    '/',
    checkRoleMiddleware([RolesEnum.ADMIN, RolesEnum.COMPANY_ADMIN, RolesEnum.SUBSCRIBER]),
    hasUserCompanyMiddleware,
    createOrUpdateActivityValidator(),
    activityController.createActivity.bind(activityController)
);

router.get(
    '/',
    authMiddleware,
    hasUserCompanyMiddleware,
    activityController.getActivities.bind(activityController)
);

router.get(
    '/:id',
    authMiddleware,
    hasUserCompanyMiddleware,
    activityController.getActivityById.bind(activityController)
);

router.put(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN, RolesEnum.COMPANY_ADMIN, RolesEnum.SUBSCRIBER]),
    hasUserCompanyMiddleware,
    createOrUpdateActivityValidator(),
    activityController.updateActivity.bind(activityController)
);

router.delete(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN, RolesEnum.COMPANY_ADMIN, RolesEnum.SUBSCRIBER]),
    hasUserCompanyMiddleware,
    activityController.deleteActivity.bind(activityController)
);

router.post(
    '/add-employee/:id',
    authMiddleware,
    hasUserCompanyMiddleware,
    activityController.addEmployee.bind(activityController)
);

router.post(
    '/delete-employee/:id',
    authMiddleware,
    hasUserCompanyMiddleware,
    activityController.deleteEmployee.bind(activityController)
);

export default router;