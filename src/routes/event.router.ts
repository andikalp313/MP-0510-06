import { Router } from "express";
import { uploader } from "../lib/multer";
import { validateCreateEvent } from "../validators/event.validator";
import {
  createEventController,
  deleteEventController,
  getEventController,
  getEventsByUserController,
  getEventsController,
} from "../controller/event.controller";
import { verifyToken } from "../lib/jwt";
import { fileFilter } from "../lib/fileFilter";

const router = Router();

router.get("/", getEventsController);
router.get("/byuser", verifyToken, getEventsByUserController);
router.get("/:id", getEventController);
router.post(
  "/create-event",
  verifyToken,

  uploader().fields([{ name: "thumbnail", maxCount: 1 }]),
  fileFilter,
  validateCreateEvent,
  createEventController
);
router.delete("/:id", verifyToken, deleteEventController);

export default router;
