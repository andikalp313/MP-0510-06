import { NextFunction, Request, Response } from "express";
import changePasswordService from "../services/profile/change-password.service";
import { getProfileService } from "../services/profile/get-profile.service";
import { updateProfileService } from "../services/profile/update-profile.service";

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

export const updateProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

    const result = await updateProfileService(
      req.body,
      files.profilePicture?.[0],
      res.locals.user.id
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const  userId  = Number(res.locals.user.id);
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!userId || !oldPassword || !newPassword || !confirmPassword) {
       res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = await changePasswordService(Number(userId), oldPassword, newPassword, confirmPassword);
     res.status(200).json({
      message: "Password changed successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
