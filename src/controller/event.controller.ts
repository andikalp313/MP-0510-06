import { NextFunction, Request, Response } from "express";
import { createEventService } from "../services/Events/create-event.service";
import { getEventsService } from "../services/Events/get.events.service";
import { getEventService } from "../services/Events/get.event.service";

export const createEventControll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = 1; // ID user default untuk pengujian
    const thumbnail = (
      req.files as unknown as { thumbnail: Express.Multer.File[] }
    ).thumbnail?.[0]; // Pastikan thumbnail diakses dengan benar

    if (!thumbnail) {
      res.status(400).json({ message: "Thumbnail is required" });
      return;
    }

    const result = await createEventService(req.body, thumbnail, userId);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating event:", error);
    next(error); // Gunakan middleware error handling untuk response error
  }
};

export const getEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 3,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
      location: (req.query.location as string) || "",
      category: (req.query.category as string) || "",
    };

    console.log(query);

    const result = await getEventsService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await getEventService(id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
