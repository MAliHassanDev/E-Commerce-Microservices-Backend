import { Router } from "express";
import { registerNewUser,authenticateUser,signOutUser } from "../controllers/authController.ts";
import { validateRegistrationData,validateSignInData } from "../middlewares/validator.ts";
const router = Router();

router.post('/signup',validateRegistrationData, registerNewUser);

router.post('/signin', validateSignInData, authenticateUser);

router.post('/signout', signOutUser);
export default router;