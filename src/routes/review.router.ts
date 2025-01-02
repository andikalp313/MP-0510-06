import { Router } from "express";
import {
  createReviewController,
  getReviewsByEventController,
  getAllReviewsController,
} from "../controller/review.controller";
import { verifyToken } from "../lib/jwt";

const router = Router();

// Route untuk membuat ulasan baru
router.post("/create-review", verifyToken, createReviewController);

// Route untuk mendapatkan ulasan berdasarkan event
router.get("/event/:eventId", getReviewsByEventController);

// Route untuk mendapatkan semua ulasan (opsional, misalnya untuk admin)
router.get("/", getAllReviewsController);

export default router;
