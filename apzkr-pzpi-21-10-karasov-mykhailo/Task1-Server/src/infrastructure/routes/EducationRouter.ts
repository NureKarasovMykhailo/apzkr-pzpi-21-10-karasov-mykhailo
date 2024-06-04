import express from "express";
import educationController from "../controllers/EducationController";
import createEducationValidator from "../../core/common/validators/CreateEducationValidator";
import checkRoleMiddleware from "../../core/common/middlewares/CheckRoleMiddleware";
import RolesEnum from "../../core/common/enums/RolesEnum";
import authMiddleware from "../../core/common/middlewares/AuthMiddleware";

const router = express.Router();

router.post(
    '/',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    createEducationValidator(),
    educationController.createEducation.bind(educationController)
);
router.get(
    '/',
    authMiddleware,
    educationController.getAll.bind(educationController)
);
router.get(
    '/:id',
    authMiddleware,
    educationController.getById.bind(educationController)
);
router.put(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    createEducationValidator(),
    educationController.updateEducation.bind(educationController)
);
router.delete(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    educationController.deleteEducation.bind(educationController)
);

export default router;