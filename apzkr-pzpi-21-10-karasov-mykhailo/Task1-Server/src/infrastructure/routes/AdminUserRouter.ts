import express from "express";
import createUserValidator from "../../core/common/validators/CreateUserValidator";
import updateUserValidator from "../../core/common/validators/UpdateUserValidator";
import checkRoleMiddleware from "../../core/common/middlewares/CheckRoleMiddleware";
import RolesEnum from "../../core/common/enums/RolesEnum";
import rolesEnum from "../../core/common/enums/RolesEnum";
import FileManager from "../../core/common/uttils/FileManager";
import PublicUserService from "../../core/services/PublicUserService/PublicUserService";
import UserRepositoryImpl from "../repositoriesImpl/sequelizeRepository/UserRepositoryImpl";
import SubscriptionRepositoryImpl from "../repositoriesImpl/sequelizeRepository/SubscriptionRepositoryImpl";
import AdminUserService from "../../core/services/AdminUserService/AdminUserService";
import AdminUserController from "../controllers/AdminUserController";
import RoleMapper from "../mappers/RoleMapper/RoleMapper";
import EducationMapper from "../mappers/EducationMapper/EducationMapper";
import authMiddleware from "../../core/common/middlewares/AuthMiddleware";

const router = express.Router();

const fileManager: FileManager = new FileManager();
const publicUserService = new PublicUserService(new UserRepositoryImpl(), new SubscriptionRepositoryImpl())
const userService: AdminUserService = new AdminUserService(new UserRepositoryImpl(), fileManager);

const adminUserController = new AdminUserController(
    userService,
    publicUserService,
    new RoleMapper(),
    new EducationMapper()
);


router.post(
    '/',
    createUserValidator(),
    adminUserController.createUser.bind(adminUserController)
);

router.get(
    '/',
    adminUserController.getAllUsers.bind(adminUserController)
);

router.get(
    '/:id',
    adminUserController.getUserById.bind(adminUserController)
)

router.put(
    '/:id',
    updateUserValidator(),
    adminUserController.updateUser.bind(adminUserController)
);

router.delete(
    '/:id',
    adminUserController.deleteUser.bind(adminUserController)
);

router.patch(
    '/add-role/:id',
    authMiddleware,
    checkRoleMiddleware([RolesEnum.SUBSCRIBER, RolesEnum.ADMIN, rolesEnum.COMPANY_ADMIN]),
    adminUserController.addRole.bind(adminUserController)
);

router.patch(
    '/delete-role/:id',
    checkRoleMiddleware([RolesEnum.SUBSCRIBER, RolesEnum.ADMIN, rolesEnum.COMPANY_ADMIN]),
    adminUserController.deleteRole.bind(adminUserController)
);

router.patch(
    '/add-education/:id',
    adminUserController.addEducation.bind(adminUserController)
);

router.patch(
    '/delete-education/:id',
    adminUserController.deleteEducation.bind(adminUserController)
);

export default router;