import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export const validateUpdateProfile = [
  body("name")
    .optional()
    .isString()
    .withMessage("First name must be a valid string"),

  body("email").optional().isEmail().withMessage("Invalid email format"),

  body("address")
    .optional()
    .isString()
    .withMessage("Address must be a valid string"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: "error", errors: errors.array()[0].msg });
      return;
    }
    next();
  },
];

export const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmNewPassword")
    .notEmpty()
    .withMessage("Confirm new password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password do not match");
      }
      return true;
    }),
];
