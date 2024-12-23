import { NextFunction, Request, Response } from "express";
import { createEventService } from "../services/Events/create-event.service";
import { getEventsService } from "../services/Events/get.events.service";
import { getEventService } from "../services/Events/get.event.service";


export const createEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const result = await createEventService(
      req.body,
      files.thumbnail?.[0],
      res.locals.user.id
    );

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
export const getEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 8,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
      location: (req.query.location as string) || "",
      category: (req.query.category as string) || "",
    };

    // console.log(query);

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
