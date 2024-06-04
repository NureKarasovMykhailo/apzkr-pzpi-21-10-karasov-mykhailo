import express from "express";
import checkRoleMiddleware from "../../core/common/middlewares/CheckRoleMiddleware";
import RolesEnum from "../../core/common/enums/RolesEnum";
import ComplexityService from "../../core/services/ComplexityService/ComplexityService";
import ComplexityRepositoryImpl from "../repositoriesImpl/sequelizeRepository/ComplexityRepositoryImpl";
import ComplexityController from "../controllers/ComplexityController";
import createOrUpdateComplexityValidator from "../../core/common/validators/CreateOrUpdateComplexityValidator";
import authMiddleware from "../../core/common/middlewares/AuthMiddleware";
import MapperFabric from "../mappers/MapperFabric";
import MappersEnum from "../../core/common/enums/MappersEnum";

const router = express.Router();

const complexityRepository = new ComplexityRepositoryImpl();
const complexityService = new ComplexityService(complexityRepository);
const complexityController = new ComplexityController(complexityService, MapperFabric.getMapper(MappersEnum.ComplexityMapper));

router.post(
    '/',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    createOrUpdateComplexityValidator(),
    complexityController.createComplexity.bind(complexityController)
);

router.get(
    '/',
    authMiddleware,
    complexityController.getComplexities.bind(complexityController)
);

router.get(
    '/:id',
    authMiddleware,
    complexityController.getOneComplexity.bind(complexityController)
);

router.put(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    createOrUpdateComplexityValidator(),
    complexityController.updateComplexity.bind(complexityController)
);

router.delete(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    complexityController.deleteComplexity.bind(complexityController)
);

export default router;