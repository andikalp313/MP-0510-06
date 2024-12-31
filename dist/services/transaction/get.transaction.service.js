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
exports.getTransactionService = void 0;
const prisma_1 = require("../../lib/prisma");
const getTransactionService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield prisma_1.prisma.transaction.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, points: true } },
                voucher: { select: { voucherCode: true, value: true } },
                coupon: { select: { couponCode: true, discountValue: true } },
                event: { select: { title: true } },
            },
        });
        if (!transaction) {
            throw new Error("Invalid transaction id");
        }
        return transaction;
    }
    catch (error) {
        throw error;
    }
});
exports.getTransactionService = getTransactionService;
