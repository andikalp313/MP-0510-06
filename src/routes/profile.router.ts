// src/routes/userRoutes.ts
import { Router } from "express";

import { verifyToken } from "../lib/jwt";
import { changePasswordController, getProfileController, updateProfileController } from "../controller/profile.controller";
import { uploader } from "../lib/multer";
import { fileFilter } from "../lib/fileFilter";
import { validateChangePassword } from "../validators/profile.validator";

const router = Router();

// Endpoint untuk mendapatkan profil pengguna
router.get("/profile", verifyToken, getProfileController);
router.patch(
    "/",
    verifyToken,
    uploader(1).fields([{ name: "profilePicture", maxCount: 1 }]),
    fileFilter,
    updateProfileController
  );
  
  router.patch(
    "/change-password:id",
    verifyToken,
    validateChangePassword,
    changePasswordController
  );
  
  export default router;
  
