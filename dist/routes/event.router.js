"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../lib/multer");
const event_controller_1 = require("../controller/event.controller");
const router = (0, express_1.Router)();
router.get("/", event_controller_1.getEventsController);
router.post("/", 
// verifyToken,
(0, multer_1.uploader)().fields([{ name: "thumbnail", maxCount: 1 }]), 
// fileFilter,
// validateCreateEvent,
event_controller_1.createEventControll);
exports.default = router;
