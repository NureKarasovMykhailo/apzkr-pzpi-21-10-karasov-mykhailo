import express, {Router} from "express";
import registrationValidator from "../../core/common/validators/RegistrationValidator";
const router: Router = express.Router();
import authMiddleware from '../../core/common/middlewares/AuthMiddleware';
import AuthService from "../../core/services/AuthService/AuthService";
import AuthRepositoryImpl from "../repositoriesImpl/sequelizeRepository/AuthRepositoryImpl";
import AuthController from "../controllers/AuthController";
import UserRepositoryImpl from "../repositoriesImpl/sequelizeRepository/UserRepositoryImpl";
import MapperFabric from "../mappers/MapperFabric";
import MappersEnum from "../../core/common/enums/MappersEnum";

const authController =  new AuthController(new AuthService(new AuthRepositoryImpl( MapperFabric.getMapper(MappersEnum.UserMapper)), new UserRepositoryImpl()));

router.post('/registration', registrationValidator(), authController.registration.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/check-auth', authMiddleware, authController.checkAuth.bind(authController));

export default router;