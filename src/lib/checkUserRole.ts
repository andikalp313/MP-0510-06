import { Request, Response, NextFunction } from "express";

export const checkUserRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (user && user.role === "ADMIN") {
    return next();
  }

  res.status(403).json({
    status: "error",
    message: "Access denied. Only admin can do this action.",
  });
};
