import express from "express";
import SubscribeController from "../controllers/SubscribeController";


const router = express.Router();
const subscribeController = new SubscribeController();

router.get(
    '/:id',
    subscribeController.getSubscribeById.bind(subscribeController)
);

export default router;