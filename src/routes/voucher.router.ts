import { Router } from "express";
import { createVoucherController } from "../controller/voucher.controller";
import { verifyToken } from "../lib/jwt";

const router = Router();

router.post("/", verifyToken, createVoucherController);

export default router;
