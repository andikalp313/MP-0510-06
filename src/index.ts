import express, { NextFunction, Request, Response } from "express";
import { PORT } from "./config";
import cors from "cors";
import eventRouter from "./routes/event.router";
import authRouter from "./routes/auth.router";
import voucherRouter from "./routes/voucher.router";
import transactionRouter from "./routes/transaction.router";
import reviewRouter from "./routes/review.router";
// 1. Import cronJobs agar job aktif
import "./jobs/cronJobs";
import accountRouter from "./routes/account.router";

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/events", eventRouter);
app.use("/auth", authRouter);
app.use("/profiles", accountRouter);
app.use("/vouchers", voucherRouter);
app.use("/transactions", transactionRouter);
app.use("/reviews", reviewRouter);

//middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
