import express from "express";
import checkRoleMiddleware from "../../core/common/middlewares/CheckRoleMiddleware";
import RolesEnum from "../../core/common/enums/RolesEnum";
import createOrUpdateCompanyValidator from "../../core/common/validators/CreateOrUpdateCompanyValidator";
import AdminCompanyController from "../controllers/AdminCompanyController";
import CompanyRepositoryImpl from "../repositoriesImpl/sequelizeRepository/CompanyRepositoryImpl";
import CompanyService from "../../core/services/CompanyService/CompanyService";
import UserRepositoryImpl from "../repositoriesImpl/sequelizeRepository/UserRepositoryImpl";

const router = express.Router();
const companyController = new AdminCompanyController(new CompanyService(new CompanyRepositoryImpl(), new UserRepositoryImpl()));

router.post(
    '/',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    createOrUpdateCompanyValidator(),
    companyController.create.bind(companyController)
);

router.get(
    '/',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    companyController.getCompanies.bind(companyController)
);

router.get(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    companyController.getCompany.bind(companyController)
);

router.put(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    createOrUpdateCompanyValidator(),
    companyController.updateCompany.bind(companyController)
);

router.delete(
    '/:id',
    checkRoleMiddleware([RolesEnum.ADMIN]),
    companyController.deleteCompany.bind(companyController)
);

export default router;