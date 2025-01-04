import { prisma } from "../../lib/prisma";

export const getTransactionService = async (id: number) => {
  try {
    const transaction = await prisma.transaction.findUnique({
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
  } catch (error) {
    throw error;
  }
};
