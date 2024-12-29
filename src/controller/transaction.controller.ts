import { Request, Response, NextFunction } from "express";
import { createTransaction } from "../services/transaction/transaction.service";

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

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
