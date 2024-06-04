import express from "express";
import updateUserPublicValidator from "../../core/common/validators/UpdateUserPublicValidator";
import authMiddleware from "../../core/common/middlewares/AuthMiddleware";
import PublicUserController from "../controllers/PublicUserController";
import PublicUserService from "../../core/services/PublicUserService/PublicUserService";
import SubscriptionRepositoryImpl from "../repositoriesImpl/sequelizeRepository/SubscriptionRepositoryImpl";
import UserRepositoryImpl from "../repositoriesImpl/sequelizeRepository/UserRepositoryImpl";

const router = express.Router();

const userRepository = new UserRepositoryImpl();
const subscribeRepository = new SubscriptionRepositoryImpl();
const userService = new PublicUserService(userRepository, subscribeRepository);
const publicUserController = new PublicUserController(userService);

router.patch(
    '/',
    authMiddleware,
    updateUserPublicValidator(),
    publicUserController.updateUser.bind(publicUserController)
);

router.put(
    '/add-education',
    authMiddleware,
    publicUserController.addEducation.bind(publicUserController)
);

router.put(
    '/delete-education',
    authMiddleware,
    publicUserController.deleteEducation.bind(publicUserController)
);

router.post(
    '/subscribe',
    authMiddleware,
    publicUserController.subscribe.bind(publicUserController)
);

router.get(
    '/',
    authMiddleware,
    publicUserController.getUserInfoByToken.bind(publicUserController)
);

export default router;