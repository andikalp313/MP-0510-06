import { Router } from "express";

import { verifyToken } from "../lib/jwt";
import {
  createTransactionController,
  gettransactionController,
  getTransactionsByUserController,
  PaymentProofController,
} from "../controller/transaction.controller";
import { uploader } from "../lib/multer";
import { fileFilter } from "../lib/fileFilter";
import { checkUserRole } from "../lib/checkUserRole";

const router = Router();

router.get("/:id", gettransactionController);
router.get(
"/by-user/:id",
  verifyToken,
  checkUserRole,
  getTransactionsByUserController
);
router.post("/create", verifyToken, createTransactionController);
router.patch(
  "/payment-proof/:id",
  verifyToken,
  uploader().single("paymentProof"),
  fileFilter,
  PaymentProofController
);


export default router;
