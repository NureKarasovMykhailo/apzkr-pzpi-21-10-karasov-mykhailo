import express from "express";
import RoleController from "../controllers/RoleController";
import createRoleValidator from "../../core/common/validators/CreateRoleValidator";
import checkRoleMiddleware from "../../core/common/middlewares/CheckRoleMiddleware";
import rolesEnum from "../../core/common/enums/RolesEnum";
import authMiddleware from "../../core/common/middlewares/AuthMiddleware";
import RolesEnum from "../../core/common/enums/RolesEnum";
const router = express.Router();

const roleController  = new RoleController();

router.post(
    '/',
    //checkRoleMiddleware([rolesEnum.ADMIN]),
    createRoleValidator(),
    roleController.create.bind(roleController)
);
router.get(
    '/',
   // authMiddleware,
    roleController.getAll.bind(roleController)
);
router.get(
    '/:id',
    authMiddleware,
    roleController.getOne.bind(roleController)
);
router.put(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    roleController.update.bind(roleController)
);
router.delete(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    roleController.delete.bind(roleController)
);

export default router;