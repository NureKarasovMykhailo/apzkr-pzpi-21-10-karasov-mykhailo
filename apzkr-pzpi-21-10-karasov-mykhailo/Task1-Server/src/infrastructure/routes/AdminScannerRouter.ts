import express from "express";
import checkRoleMiddleware from "../../core/common/middlewares/CheckRoleMiddleware";
import RolesEnum from "../../core/common/enums/RolesEnum";
import AdminScannerController from "../controllers/AdminScannerController";
import ScannerService from "../../core/services/ScannerService/ScannerService";
import ScannerRepositoryImpl from "../repositoriesImpl/sequelizeRepository/ScannerRepositoryImpl";
import UserRepositoryImpl from "../repositoriesImpl/sequelizeRepository/UserRepositoryImpl";

const router = express.Router();
const adminScannerController = new AdminScannerController(new ScannerService(new ScannerRepositoryImpl(), new UserRepositoryImpl()));

router.post(
    '/',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    adminScannerController.create.bind(adminScannerController)
);

router.get(
    '/',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    adminScannerController.getAllScanners.bind(adminScannerController)
);

router.get(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    adminScannerController.getScanner.bind(adminScannerController)
);

router.put(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    adminScannerController.updateScanner.bind(adminScannerController)
);

router.delete(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    adminScannerController.deleteScanner.bind(adminScannerController)
);

export default router;