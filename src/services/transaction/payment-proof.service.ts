import { cloudinaryUpload } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";

interface UploadPaymentProofBody {
  transactionId: number;
  paymentProof: any; // or a more specific type if you know it
}

export const PaymentProofService = async ({
  transactionId,
  paymentProof,
}: UploadPaymentProofBody) => {
  if (!transactionId || !paymentProof) {
    throw new Error("Transaction ID and payment proof are required.");
  }

  try {
    // Mengupload file ke Cloudinary
    const { secure_url } = await cloudinaryUpload(paymentProof);

    if (!secure_url) {
      throw new Error("Failed to upload payment proof to Cloudinary.");
    }

    // Memastikan transaksi dengan ID yang diberikan ada
    const transaction = await prisma.transaction.findUnique({
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
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentProof: secure_url,
        status: "AWAITING_APPROVAL",
      },
    });

    return updatedTransaction;
  } catch (error) {
    console.error("Error in uploadPaymentProofService:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred."
    );
  }
};
