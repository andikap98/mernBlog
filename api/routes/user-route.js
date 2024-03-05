import express from "express";
import verifyUser from "../utils/verifyUser.js";
import userController from "../controllers/user-controller.js";

const router = express.Router();

router.get('/test', userController.test);
router.use(verifyUser);
router.put('/update/:idUser', userController.update)

export default router;