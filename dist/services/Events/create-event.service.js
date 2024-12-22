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
exports.createEventService = void 0;
const cloudinary_1 = require("../../lib/cloudinary");
const prisma_1 = require("../../lib/prisma");
const createEventService = (body, thumbnail, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validasi input sederhana
        if (!body.title || !thumbnail) {
            throw new Error("Title and thumbnail are required");
        }
        // Periksa apakah event  n  dengan judul yang sama sudah ada
        const existingEvent = yield prisma_1.prisma.event.findFirst({
            where: { title: body.title },
        });
        if (existingEvent) {
            throw new Error("Title already in use");
        }
        // Upload thumbnail ke Cloudinary
        const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(thumbnail);
        // Parsing tipe data yang sesuai
        const eventData = Object.assign(Object.assign({}, body), { price: Number(body.price), avaliableSeats: Number(body.avaliableSeats), startDate: new Date(body.startDate), endDate: new Date(body.endDate), thumbnail: secure_url, userId });
        // Buat data event baru
        return yield prisma_1.prisma.event.create({
            data: eventData,
        });
    }
    catch (error) {
        throw new Error("Failed to create event");
    }
});
exports.createEventService = createEventService;
