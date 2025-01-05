import { NextFunction, Request as ExpressRequest, Response } from "express";
import { getProfileService } from "../services/profile/get-profile.service";

interface CustomRequest extends ExpressRequest {
  user?: {
    id: number;
  };
}

export const getProfileController = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Mengambil userId dari req.user yang diatur oleh middleware autentikasi
    const userId = res.locals.user.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const profile = await getProfileService(userId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    next(error);
  }
};
