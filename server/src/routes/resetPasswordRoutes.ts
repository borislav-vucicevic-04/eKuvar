import { Router } from "express";
import verifyEmail from "../controllers/verifyEmail.controller";
import verifyOTP from "../controllers/verifyOTP.controller";
import setNewPassword from "../controllers/setNewPassword.controller";

const resetPasswordRoutes = Router();

resetPasswordRoutes.post('/verify-email', verifyEmail);
resetPasswordRoutes.post('/verify-otp', verifyOTP);
resetPasswordRoutes.post('/set-new-password', setNewPassword)

export default resetPasswordRoutes