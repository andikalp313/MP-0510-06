import { Request, Response, NextFunction } from "express";
import { createVoucherService } from "../services/voucher/create-voucher.service";

export const createVoucherController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createVoucherService(req.body);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};
