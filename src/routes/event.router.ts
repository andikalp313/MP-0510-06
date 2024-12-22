import { Router } from "express";
import { uploader } from "../lib/multer";
import { validateCreateEvent } from "../validators/event.validator";
import {
  createEventController,
  getEventController,
  getEventsController,
} from "../controller/event.controller";
import { verifyToken } from "../lib/jwt";
import { fileFilter } from "../lib/fileFilter";

const router = Router();

router.get("/", getEventsController);
router.get("/:id", getEventController);
router.post(
  "/",
  // verifyToken,
  uploader().fields([{ name: "thumbnail", maxCount: 1 }]),
  fileFilter,
  validateCreateEvent,
  createEventController
);

export default router;
