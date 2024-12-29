import { PrismaClient, TransactionStatus, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateTransactionParams {
  // userId SEKARANG diisi dari token, bukan body
  userId: number;
  eventId: number;
  qty: number;
  pointsUsed?: number;
  voucherCode?: string;
  couponCode?: string;
  paymentProof?: string;
  ticketType: "REGULER" | "VIP" | "VVIP";
}

export async function createTransaction({
  userId,
  eventId,
  qty,
  pointsUsed,
  voucherCode,
  couponCode,
  paymentProof,
  ticketType,
}: CreateTransactionParams) {
  return await prisma.$transaction(async (tx) => {
    // Validasi eventId
    const events = await tx.event.findUnique({
      where: { id: eventId },
    });
    if (!events) {
      throw new Error("Invalid eventId");
    }

    // Step 1: Validasi poin user
    if (pointsUsed) {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new Error("User not found");
      if (user.points < pointsUsed) {
        throw new Error("Insufficient points");
      }
    }
    // Step 1: Validasi couponCode
    let coupon = null;
    if (couponCode) {
      coupon = await tx.coupon.findFirst({
        where: { couponCode },
      });
      if (!coupon) throw new Error("Invalid couponCode");
      if (coupon.isUsed) {
        throw new Error("Coupon has already been used");
      }
    }

    // Step 2: Validasi voucherCode
    let voucher: Prisma.VoucherGetPayload<{ include: { user: true } }> | null =
      null;
    if (voucherCode) {
      voucher = await tx.voucher.findFirst({
        where: {
          voucherCode,
          expDate: { gte: new Date() },
        },
        include: {
          user: true,
        },
      });
      if (!voucher) {
        throw new Error("Invalid or expired voucherCode");
      }
      if (voucher.qty <= voucher.usedQty) {
        throw new Error("Voucher quota exceeded");
      }
    }

    // Step 3: Ambil detail event
    const event = await tx.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new Error("Invalid eventId");
    }

    // Step 4: Hitung harga tiket
    let ticketPrice = 0;
    if (ticketType === "REGULER") ticketPrice = event.priceReguler;
    else if (ticketType === "VIP") ticketPrice = event.priceVip;
    else if (ticketType === "VVIP") ticketPrice = event.priceVvip;

    let totalPrice = ticketPrice * qty;

    // Step 5: Kurangi harga dengan poin
    if (pointsUsed) totalPrice -= pointsUsed;
    // Step 6: Kurangi harga dengan voucher
    if (voucher) totalPrice -= voucher.value;
    // Step 7: Kurangi harga dengan coupon
    if (coupon) totalPrice -= coupon.discountValue;
    // Step 8: Pastikan tidak minus
    if (totalPrice < 0) totalPrice = 0;

    // Step 9: Buat transaksi
    const transaction = await tx.transaction.create({
      data: {
        userId,
        eventId,
        quantity: qty,
        pointsUsed: pointsUsed || 0,
        voucherId: voucher ? voucher.id : undefined,
        couponId: coupon ? coupon.id : undefined,
        paymentProof: paymentProof || "",
        status: TransactionStatus.PENDING,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 jam
        totalPrice,
      },
    });

    // Step 10: Update jumlah kursi event
    let updateData: Prisma.EventUpdateInput = {};
    if (ticketType === "REGULER") {
      updateData = { avaliableSeatsReguler: { decrement: qty } };
    } else if (ticketType === "VIP") {
      updateData = { avaliableSeatsVip: { decrement: qty } };
    } else if (ticketType === "VVIP") {
      updateData = { avaliableSeatsVvip: { decrement: qty } };
    }
    await tx.event.update({ where: { id: eventId }, data: updateData });

    // Step 11: Update poin user
    if (pointsUsed) {
      await tx.user.update({
        where: { id: userId },
        data: { points: { decrement: pointsUsed } },
      });
    }

    // Step 12: Update voucher usage
    if (voucher) {
      await tx.voucher.update({
        where: { id: voucher.id },
        data: { usedQty: { increment: qty } },
      });
    }

    // Step 13: Update coupon usage
    if (coupon) {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { isUsed: true },
      });
    }

    // Step 14: (Opsional) Logika pembatalan otomatis setelah 2 jam -> Cron job atau scheduling

    return transaction;
  });
}
