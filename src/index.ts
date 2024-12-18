import express, { NextFunction, Request, Response } from "express";
import { PORT } from "./config";
import cors from "cors";
import eventRouter from "./routes/event.router";
import authRouter from "./routes/auth.router";


const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/events", eventRouter);
app.use("/auth", authRouter);


//middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).send(err.message);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
