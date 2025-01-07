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
exports.PaymentProofService = void 0;
const cloudinary_1 = require("../../lib/cloudinary");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const PaymentProofService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ transactionId, paymentProof, }) {
    if (!transactionId || !paymentProof) {
        throw new Error("Transaction ID and payment proof are required.");
    }
    try {
        // Mengupload file ke Cloudinary
        const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(paymentProof);
        if (!secure_url) {
            throw new Error("Failed to upload payment proof to Cloudinary.");
        }
        // Memastikan transaksi dengan ID yang diberikan ada
        const transaction = yield prisma_1.default.transaction.findUnique({
            where: { id: transactionId },
            include: { user: true, event: true }, // Tambahkan relasi jika diperlukan
        });
        if (!transaction) {
            throw new Error(`Transaction with ID ${transactionId} not found.`);
        }
        // Validasi status transaksi
        if (transaction.status !== "PENDING") {
            throw new Error("Only pending transactions can upload payment proof.");
        }
        // Update transaksi dengan URL bukti pembayaran
        const updatedTransaction = yield prisma_1.default.transaction.update({
            where: { id: transactionId },
            data: {
                paymentProof: secure_url,
                status: "AWAITING_APPROVAL",
            },
        });
        return updatedTransaction;
    }
    catch (error) {
        console.error("Error in uploadPaymentProofService:", error);
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
});
exports.PaymentProofService = PaymentProofService;
