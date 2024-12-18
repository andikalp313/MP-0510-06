import { Router } from "express";
import { registerController } from "../controller/auth.controller";
import { validateRegister } from "../validator/auth.validator";

const router = Router();

router.post("/register", validateRegister, registerController);

export default router;
