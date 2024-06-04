import express from "express";
import ScannerController from "../controllers/ScannerController";
import ScannerService from "../../core/services/ScannerService/ScannerService";
import ScannerRepositoryImpl from "../repositoriesImpl/sequelizeRepository/ScannerRepositoryImpl";
import checkRoleMiddleware from "../../core/common/middlewares/CheckRoleMiddleware";
import RolesEnum from "../../core/common/enums/RolesEnum";
import authMiddleware from "../../core/common/middlewares/AuthMiddleware";
import hasUserCompanyMiddleware from "../../core/common/middlewares/HasUserCompanyMiddleware";
import UserRepositoryImpl from "../repositoriesImpl/sequelizeRepository/UserRepositoryImpl";
import MapperFabric from "../mappers/MapperFabric";
import MappersEnum from "../../core/common/enums/MappersEnum";

const router = express.Router();

const scannerService = new ScannerService(new ScannerRepositoryImpl(), new UserRepositoryImpl());
const scannerController = new ScannerController(scannerService, MapperFabric.getMapper(MappersEnum.ScannerMapper));

router.post(
    '/',
    checkRoleMiddleware([RolesEnum.SUBSCRIBER, RolesEnum.ADMIN, RolesEnum.COMPANY_ADMIN]),
    scannerController.createScanner.bind(scannerController)
);

router.get(
    '/',
    authMiddleware,
    hasUserCompanyMiddleware,
    scannerController.getCompanyScanners.bind(scannerController)
);

router.get(
    '/:id',
    authMiddleware,
    hasUserCompanyMiddleware,
    scannerController.getScannerById.bind(scannerController)
);

router.put(
    '/:id',
    checkRoleMiddleware([RolesEnum.COMPANY_ADMIN, RolesEnum.SUBSCRIBER, RolesEnum.ADMIN]),
    hasUserCompanyMiddleware,
    scannerController.updateScanner.bind(scannerController)
);


router.delete(
    '/:id',
    checkRoleMiddleware([RolesEnum.COMPANY_ADMIN, RolesEnum.SUBSCRIBER, RolesEnum.ADMIN]),
    hasUserCompanyMiddleware,
    scannerController.deleteScanner.bind(scannerController)
);


export default router;