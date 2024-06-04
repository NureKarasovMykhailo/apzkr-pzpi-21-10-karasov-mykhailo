import express from "express";
import checkRoleMiddleware from "../../core/common/middlewares/CheckRoleMiddleware";
import RolesEnum from "../../core/common/enums/RolesEnum";
import AdminScannerHistoryController from "../controllers/AdminScannerHistoryController";
import ScannerHistoryService from "../../core/services/ScannerHistoryService/ScannerHistoryService";
import ScannerHistoryRepositoryImpl from "../repositoriesImpl/sequelizeRepository/ScannerHistoryRepositoryImpl";
import ScannerRepositoryImpl from "../repositoriesImpl/sequelizeRepository/ScannerRepositoryImpl";

const router = express.Router();
const adminScannerHistoryController = new AdminScannerHistoryController(new ScannerHistoryService(new ScannerHistoryRepositoryImpl(), new ScannerRepositoryImpl()));

router.post(
    '/',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    adminScannerHistoryController.create.bind(adminScannerHistoryController)
);

router.get(
    '/',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    adminScannerHistoryController.getAllScannerHistory.bind(adminScannerHistoryController)
);

router.get(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    adminScannerHistoryController.getScannerHistoryById.bind(adminScannerHistoryController)
);

router.put(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    adminScannerHistoryController.updateScannerHistory.bind(adminScannerHistoryController)
);

router.delete(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    adminScannerHistoryController.deleteScanner.bind(adminScannerHistoryController)
);

export default router;