"use strict";
// src/services/eventService.ts
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
exports.getEventService = void 0;
const prisma_1 = require("../../lib/prisma");
const getEventService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield prisma_1.prisma.event.findUnique({
            where: { id },
            include: {
                user: {
                    select: { name: true },
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                profilPicture: true, // Jika Anda memiliki field profilPicture
                            },
                        },
                    },
                },
            },
        });
        if (!event) {
            throw new Error("Invalid event id");
        }
        // Menghitung rata-rata rating dan jumlah ulasan
        const ratings = event.reviews.map((review) => review.rating);
        const totalReviews = ratings.length;
        const averageRating = totalReviews > 0 ? ratings.reduce((a, b) => a + b, 0) / totalReviews : 0;
        // Menambahkan informasi rating ke objek event
        return Object.assign(Object.assign({}, event), { averageRating: averageRating.toFixed(1), // Rata-rata rating dengan 1 desimal
            totalReviews });
    }
    catch (error) {
        console.error("Error in getEventService:", error);
        throw error;
    }
});
exports.getEventService = getEventService;
