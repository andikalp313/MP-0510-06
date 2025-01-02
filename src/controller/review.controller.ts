import { NextFunction, Request, Response } from "express";
import { createReview } from "../services/review/create-review.service";
import { getReviewsByEvent } from "../services/review/get-review-by-event.service";
import { getAllReviews } from "../services/review/get-reviews.service";

export const createReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const { eventId, rating, comment } = req.body;

    // Validasi input
    if (!userId || !eventId || !rating || !comment) {
      res.status(400).json({ message: "Semua field diperlukan." });
      return;
    }

    const review = await createReview({ userId, eventId, rating, comment });
    res.status(200).send(review);
  } catch (error) {
    next(error);
  }
};

export const getReviewsByEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = parseInt(req.params.eventId);

    if (isNaN(eventId)) {
      res.status(400).json({ message: "Event ID harus berupa angka." });
    }

    const reviews = await getReviewsByEvent(eventId);
    res.status(200).send(reviews);
  } catch (error) {
    next(error);
  }
};

export const getAllReviewsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await getAllReviews();
    res.status(200).send(reviews);
  } catch (error) {
    next(error);
  }
};
