import express from "express";
import { verifyToken } from "../lib/jwt";
import { validateCreateVoucher } from "../validators/voucher.validator";

import { createVoucherController } from "../controller/voucher.controller";

const router = express.Router();

router.post("/", verifyToken, validateCreateVoucher, createVoucherController);

export default router;
