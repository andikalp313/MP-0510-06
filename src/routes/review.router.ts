import { Router } from "express";
import {
  createReviewController,
  getReviewsByEventController,
  getAllReviewsController,
} from "../controller/review.controller";
import { verifyToken } from "../lib/jwt";

const router = Router();

router.post("/create-review", verifyToken, createReviewController);

router.get("/event/:eventId", getReviewsByEventController);

router.get("/", getAllReviewsController);

export default router;
