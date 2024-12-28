import { PrismaClient, TransactionStatus, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateTransactionParams {
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
    // Step 1: Validasi poin user
    if (pointsUsed) {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.points < pointsUsed) {
        throw new Error("Insufficient points");
      }
    }
    // Step 1: Validasi couponCode
    let coupon = null;
    if (couponCode) {
      coupon = await tx.coupon.findFirst({
        where: { couponCode: couponCode },
      });

      if (!coupon) {
        throw new Error("Invalid couponCode");
      }
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
          voucherCode: voucherCode,
          expDate: { gte: new Date() }, // Validasi masa berlaku voucher
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

    // Step 4: Hitung harga tiket berdasarkan jenis tiket dan jumlah
    let ticketPrice = 0;
    if (ticketType === "REGULER") {
      ticketPrice = event.priceReguler;
    } else if (ticketType === "VIP") {
      ticketPrice = event.priceVip;
    } else if (ticketType === "VVIP") {
      ticketPrice = event.priceVvip;
    }

    let totalPrice = ticketPrice * qty;

    // Step 5: Kurangi harga dengan poin yang digunakan
    if (pointsUsed) {
      totalPrice -= pointsUsed;
    }

    // Step 6: Kurangi harga dengan nilai voucher jika ada
    if (voucher) {
      totalPrice -= voucher.value;
    }

    // Step 7: Kurangi harga dengan nilai coupon jika ada
    if (coupon) {
      totalPrice -= coupon.discountValue;
    }

    // Step 8: Pastikan total price tidak negatif
    if (totalPrice < 0) {
      totalPrice = 0;
    }

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

    await tx.event.update({
      where: { id: eventId },
      data: updateData,
    });

    // Step 11: Update poin user jika digunakan
    if (pointsUsed) {
      await tx.user.update({
        where: { id: userId },
        data: { points: { decrement: pointsUsed } },
      });
    }

    // Step 12: Tandai voucher sebagai digunakan
    if (voucher) {
      await tx.voucher.update({
        where: { id: voucher.id },
        data: {
          usedQty: { increment: qty },
        },
      });
    }

    // Step 13: Tandai coupon sebagai digunakan
    if (coupon) {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { isUsed: true },
      });
    }

    // Step 14: Atur scheduler untuk membatalkan transaksi jika tidak selesai dalam 2 jam
    setTimeout(async () => {
      try {
        const foundTransaction = await prisma.transaction.findUnique({
          where: { id: transaction.id },
        });

        if (
          foundTransaction &&
          foundTransaction.status === TransactionStatus.PENDING
        ) {
          await prisma.transaction.update({
            where: { id: foundTransaction.id },
            data: { status: TransactionStatus.CANCELED },
          });

          // Kembalikan jumlah kursi jika transaksi dibatalkan
          await tx.event.update({
            where: { id: eventId },
            data: updateData,
          });
        }
      } catch (error) {
        console.error("Failed to handle transaction cancellation:", error);
      }
    }, 2 * 60 * 60 * 1000);

    return transaction;
  });
}
