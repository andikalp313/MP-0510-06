import { Router } from "express";

import { verifyToken } from "../lib/jwt";
import { createTransactionController } from "../controller/transaction.controller";

const router = Router();

router.post("/create", verifyToken, createTransactionController);

export default router;
