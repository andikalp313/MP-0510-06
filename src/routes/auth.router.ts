import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  registerAdminController,
  registerController,
  resetPasswordController,
} from "../controller/auth.controller";
import {
  validateOrganizerRegister,
  validateForgotPassword,
  validateLogin,
  validateRegister,
  validateResetPassword,
} from "../validators/auth.validator";
import { verifyTokenReset } from "../lib/jwt";

const router = Router();

router.post("/register", validateRegister, registerController);
router.post("/register", validateOrganizerRegister, registerAdminController);
router.post("/login", validateLogin, loginController);
router.post(
  "/forgot-password",
  validateForgotPassword,
  forgotPasswordController
);
router.patch(
  "/reset-password",
  verifyTokenReset,
  validateResetPassword,
  resetPasswordController
);

export default router;
