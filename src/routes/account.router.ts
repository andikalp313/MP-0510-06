import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import { getProfileController } from "../controller/account.controller";

const router = Router();

router.get("/:id",verifyToken, getProfileController);

export default router;
