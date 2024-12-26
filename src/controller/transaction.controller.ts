// import { Request, Response, NextFunction } from "express";
// import { transactionService } from "../services/transaction/transaction.service";

// export const createTransactionController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const result = await transactionService.createTransaction(req.body);
//     res.status(201).json(result);
//   } catch (error) {
//     next(error);
//   }
// };
