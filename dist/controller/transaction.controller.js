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
exports.createTransactionController = void 0;
const transaction_service_1 = require("../services/transaction/transaction.service");
const createTransactionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ambil userId dari res.locals.user (diset oleh middleware auth)
        const userIdFromToken = res.locals.user.id;
        // Sementara field lain (eventId, qty, dsb.) tetap diambil dari body
        const { eventId, qty, pointsUsed, voucherCode, couponCode, paymentProof, ticketType, } = req.body;
        // Panggil service createTransaction dengan userId yang sudah diverifikasi
        const result = yield (0, transaction_service_1.createTransaction)({
            userId: userIdFromToken, // Ambil dari token, BUKAN dari body
            eventId,
            qty,
            pointsUsed,
            voucherCode,
            couponCode,
            paymentProof,
            ticketType,
        });
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.createTransactionController = createTransactionController;
