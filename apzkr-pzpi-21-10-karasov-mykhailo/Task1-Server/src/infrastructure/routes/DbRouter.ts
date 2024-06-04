import express from "express";
import checkRoleMiddleware from "../../core/common/middlewares/CheckRoleMiddleware";
import RolesEnum from "../../core/common/enums/RolesEnum";
import DbController from "../controllers/DbController";

const router = express.Router();
const dbController = new DbController();

router.get(
    '/',
    //checkRoleMiddleware([RolesEnum.ADMIN]),
    dbController.exportDb.bind(dbController)
);

router.post(
    '/',
    dbController.importDb.bind(dbController)
);

export default router;