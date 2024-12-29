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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// /**
//  * Job 1: Cancel transaction after 2 hours if paymentProof is still empty or status is PENDING
//  * Runs every 10 minutes (misal, ganti sesuai kebutuhan).
//  * Format cron: '*/10 * * * *' -> setiap 10 menit/
node_cron_1.default.schedule("*/10 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running 2-hours check for pending transactions...");
    try {
        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        // Cari semua transaksi yang:
        //  1) Status = PENDING
        //  2) createdAt <= twoHoursAgo (sudah lewat 2 jam)
        //  3) paymentProof masih kosong ("" atau null, sesuaikan dengan schema Anda)
        const transactions = yield prisma.transaction.findMany({
            where: {
                status: client_1.TransactionStatus.PENDING,
                createdAt: { lte: twoHoursAgo },
                OR: [{ paymentProof: null }, { paymentProof: "" }],
            },
        });
        for (const trx of transactions) {
            // Ubah status jadi CANCELED
            yield prisma.transaction.update({
                where: { id: trx.id },
                data: {
                    status: client_1.TransactionStatus.CANCELED,
                },
            });
            // Kembalikan seat, dsb.
            yield revertSeats(trx);
            console.log(`Transaction ID ${trx.id} canceled due to 2 hours timeout.`);
        }
    }
    catch (error) {
        console.error("Failed to handle 2-hours pending cancellation:", error);
    }
}));
/**
 * Job 2: Cancel transaction after 3 days if status is AWAITING_APPROVAL (atau PENDING)
 * Runs every day at 00:00
 * Format cron: '0 0 * * *'
 */
node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running 3-days check for awaiting-approval transactions...");
    try {
        const now = new Date();
        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        // Cari transaksi yang sudah lewat 3 hari
        // dan statusnya AWAITING_APPROVAL atau PENDING (tergantung alur)
        const transactions = yield prisma.transaction.findMany({
            where: {
                createdAt: { lte: threeDaysAgo },
                status: {
                    in: [client_1.TransactionStatus.AWAITING_APPROVAL, client_1.TransactionStatus.PENDING],
                },
            },
        });
        for (const trx of transactions) {
            yield prisma.transaction.update({
                where: { id: trx.id },
                data: {
                    status: client_1.TransactionStatus.CANCELED,
                },
            });
            // Kembalikan seat, dsb.
            yield revertSeats(trx);
            console.log(`Transaction ID ${trx.id} canceled due to 3 days no organizer action.`);
        }
    }
    catch (error) {
        console.error("Failed to handle 3-days approval cancellation:", error);
    }
}));
/**
 * Fungsi helper untuk kembalikan seats
 * (Bisa juga menambah logic untuk mengembalikan voucher, coupon, poin user, dsb.)
 */
function revertSeats(trx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Ambil info event terkait
            const event = yield prisma.event.findUnique({
                where: { id: trx.eventId },
            });
            if (!event)
                return;
            // Pastikan transaction punya kolom ticketType (REGULER, VIP, VVIP)
            // agar tahu seat mana yang harus dikembalikan
            if (trx.ticketType === "REGULER") {
                yield prisma.event.update({
                    where: { id: trx.eventId },
                    data: {
                        avaliableSeatsReguler: {
                            increment: trx.quantity,
                        },
                    },
                });
            }
            else if (trx.ticketType === "VIP") {
                yield prisma.event.update({
                    where: { id: trx.eventId },
                    data: {
                        avaliableSeatsVip: {
                            increment: trx.quantity,
                        },
                    },
                });
            }
            else if (trx.ticketType === "VVIP") {
                yield prisma.event.update({
                    where: { id: trx.eventId },
                    data: {
                        avaliableSeatsVvip: {
                            increment: trx.quantity,
                        },
                    },
                });
            }
            console.log(`Seats reverted for transaction ID ${trx.id}`);
        }
        catch (error) {
            console.error("Failed to revert seats:", error);
        }
    });
}
