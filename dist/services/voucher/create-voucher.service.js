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
exports.createVoucherService = void 0;
const prisma_1 = require("../../lib/prisma");
const createVoucherService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validasi input sederhana
        if (!body.eventId ||
            !body.code ||
            !body.discountValue ||
            !body.startDate ||
            !body.endDate) {
            throw new Error("All fields are required");
        }
        // Buat data voucher baru
        const voucher = yield prisma_1.prisma.voucher.create({
            data: {
                eventId: body.eventId,
                code: body.code,
                discountValue: body.discountValue,
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
            },
        });
        return voucher;
    }
    catch (error) {
        throw new Error("Failed to create voucher");
    }
});
exports.createVoucherService = createVoucherService;
