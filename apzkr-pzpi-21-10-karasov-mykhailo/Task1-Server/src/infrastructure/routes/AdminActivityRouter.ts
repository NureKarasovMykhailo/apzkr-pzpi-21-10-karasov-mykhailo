import express from "express";
import ActivityService from "../../core/services/ActivityService/ActivityService";
import ActivityRepositoryImpl from "../repositoriesImpl/sequelizeRepository/ActivityRepositoryImpl";
import UserRepositoryImpl from "../repositoriesImpl/sequelizeRepository/UserRepositoryImpl";
import checkRoleMiddleware from "../../core/common/middlewares/CheckRoleMiddleware";
import RolesEnum from "../../core/common/enums/RolesEnum";
import AdminActivityController from "../controllers/AdminActivityController";
import createOrUpdateActivityValidator from "../../core/common/validators/CreateOrUpdateActivityValidator";

const router = express.Router();
const adminActivityController = new AdminActivityController(new ActivityService(new ActivityRepositoryImpl(), new UserRepositoryImpl()));

router.post(
    '/',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    createOrUpdateActivityValidator(),
    adminActivityController.create.bind(adminActivityController)
);

router.get(
    '/',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    adminActivityController.getAll.bind(adminActivityController)
);

router.get(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    adminActivityController.getActivityById.bind(adminActivityController)
);

router.put(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    createOrUpdateActivityValidator(),
    adminActivityController.update.bind(adminActivityController)
);

router.delete(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    adminActivityController.delete.bind(adminActivityController)
);

router.post(
    '/add-employee/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    adminActivityController.addEmployee.bind(adminActivityController)
);

router.post(
    '/delete-employee/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    adminActivityController.deleteEmployee.bind(adminActivityController)
);

export default router;