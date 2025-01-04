import { getTransactionService } from "../services/transaction/get-transaction.service";
import { Request, Response, NextFunction } from "express";
import { createTransaction } from "../services/transaction/transaction.service";
import { PaymentProofService } from "../services/transaction/payment-proof.service";

export const createTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Ambil userId dari res.locals.user (diset oleh middleware auth)
    const userIdFromToken = res.locals.user.id;

    // Sementara field lain (eventId, qty, dsb.) tetap diambil dari body
    const {
      eventId,
      qty,
      pointsUsed,
      voucherCode,
      couponCode,
      paymentProof,
      ticketType,
    } = req.body;

    // Panggil service createTransaction dengan userId yang sudah diverifikasi
    const result = await createTransaction({
      userId: userIdFromToken, // Ambil dari token, BUKAN dari body
      eventId,
      qty,
      pointsUsed,
      voucherCode,
      couponCode,
      paymentProof,
      ticketType,
    });
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const gettransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await getTransactionService(id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
export const PaymentProofController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const proofFile = req.file as Express.Multer.File; // Mendapatkan file bukti pembayaran dari request
    const transactionId = Number(req.params.id); // Mengambil ID transaksi dari parameter URL

    // Validasi input
    if (!transactionId || isNaN(transactionId)) {
      res.status(400).json({ error: "Invalid transaction ID." });
      return;
    }

    if (!proofFile) {
      res.status(400).json({ error: "Payment proof is required." });
      return;
    }

    // Memanggil service untuk memperbarui transaksi
    const updatedTransaction = await PaymentProofService({
      transactionId,
      paymentProof: proofFile,
    });

    res.status(200).json({
      message: "Payment proof uploaded successfully.",
      data: updatedTransaction,
    });
  } catch (error) {
    // Menyerahkan error ke middleware pengelola error
    next(error);
  }
};
