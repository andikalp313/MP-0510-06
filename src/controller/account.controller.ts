import { NextFunction, Request, Response } from "express";
import { getProfileService } from "../services/profile/get-profile.service";

export const getProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = Number(res.locals.user.id);
    const result = await getProfileService(parseInt(id));
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

