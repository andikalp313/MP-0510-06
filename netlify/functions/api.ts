import ServerlessHttp from "serverless-http";
import app from "../../src";
import eventRouter from "../../src/routes/event.router";
import authRouter from "../../src/routes/auth.router";
import voucherRouter from "../../src/routes/voucher.router";
import transactionRouter from "../../src/routes/transaction.router";
import reviewRouter from "../../src/routes/review.router";
import accountRouter from "../../src/routes/account.router";
import { Router } from "express";

app.use("/api/events", eventRouter);
app.use("/auth", authRouter);
app.use("/profiles", accountRouter);
app.use("/vouchers", voucherRouter);
app.use("/transactions", transactionRouter);
app.use("/reviews", reviewRouter);

const router = Router();
router.get("/hello", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/", router);

export const handler = ServerlessHttp(app);
