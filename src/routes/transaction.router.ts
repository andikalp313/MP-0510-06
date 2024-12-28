import { Router } from "express";
import { createTransactionController } from "../controller/transaction.controller";
import { verifyToken } from "../lib/jwt";

const router = Router();

router.post("/create", verifyToken, createTransactionController);

export default router;
