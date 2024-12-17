"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventsController = exports.createEventControll = void 0;
const create_event_service_1 = require("../services/Events/create-event.service");
const get_events_service_1 = require("../services/Events/get.events.service");
const createEventControll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = 1; // ID user default untuk pengujian
        const thumbnail = (_a = req.files.thumbnail) === null || _a === void 0 ? void 0 : _a[0]; // Pastikan thumbnail diakses dengan benar
        if (!thumbnail) {
            res.status(400).json({ message: "Thumbnail is required" });
            return;
        }
        const result = yield (0, create_event_service_1.createEventService)(req.body, thumbnail, userId);
        res.status(201).json(result);
    }
    catch (error) {
        console.error("Error creating event:", error);
        next(error); // Gunakan middleware error handling untuk response error
    }
});
exports.createEventControll = createEventControll;
const getEventsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            take: parseInt(req.query.take) || 3,
            page: parseInt(req.query.page) || 1,
            sortBy: req.query.sortBy || "createdAt",
            sortOrder: req.query.sortOrder || "desc",
            search: req.query.search || "",
        };
        const result = yield (0, get_events_service_1.getEventsService)(query);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getEventsController = getEventsController;
