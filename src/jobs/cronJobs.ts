// src/cronJobs.ts

import cron from "node-cron";
import { PrismaClient, TransactionStatus, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Fungsi helper untuk mengembalikan seats, vouchers, coupons, poin pengguna, dll.
 * Sekarang menerima klien transaksi sebagai parameter.
 */
async function revertSeats(tx: Prisma.TransactionClient, trx: any) {
  try {
    // 1. Mengembalikan Kursi
    const event = await tx.event.findUnique({
      where: { id: trx.eventId },
    });
    if (!event) {
      throw new Error(`Event dengan ID ${trx.eventId} tidak ditemukan.`);
    }

    const seatFieldMap: Record<string, keyof typeof event> = {
      REGULER: "avaliableSeatsReguler",
      VIP: "avaliableSeatsVip",
      VVIP: "avaliableSeatsVvip",
    };

    const seatField = seatFieldMap[trx.ticketType];
    if (seatField) {
      await tx.event.update({
        where: { id: trx.eventId },
        data: {
          [seatField]: {
            increment: trx.quantity,
          },
        },
      });
      console.log(`Seats reverted for transaction ID ${trx.id}`);
    } else {
      console.warn(
        `Unknown ticket type '${trx.ticketType}' for transaction ID ${trx.id}`
      );
    }

    // 2. Mengembalikan Voucher
    if (trx.voucherId) {
      const voucher = await tx.voucher.findUnique({
        where: { id: trx.voucherId },
      });

      if (voucher) {
        await tx.voucher.update({
          where: { id: voucher.id },
          data: {
            usedQty: {
              decrement: trx.quantity,
            },
          },
        });
        console.log(
          `Voucher ID ${voucher.id} reverted for transaction ID ${trx.id}`
        );
      } else {
        console.warn(`Voucher dengan ID ${trx.voucherId} tidak ditemukan.`);
      }
    }

    // 3. Mengembalikan Kupon
    if (trx.couponId) {
      const coupon = await tx.coupon.findUnique({
        where: { id: trx.couponId },
      });

      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: {
            isUsed: false,
          },
        });
        console.log(
          `Coupon ID ${coupon.id} reverted for transaction ID ${trx.id}`
        );
      } else {
        console.warn(`Coupon dengan ID ${trx.couponId} tidak ditemukan.`);
      }
    }

    // 4. Mengembalikan Poin Pengguna
    if (trx.pointsUsed && trx.pointsUsed > 0) {
      await tx.user.update({
        where: { id: trx.userId },
        data: {
          points: {
            increment: trx.pointsUsed,
          },
          // Sesuaikan dengan logika bisnis Anda jika diperlukan
          // pointsIsUsed: false,
          // pointsExpiryDate: null,
        },
      });
      console.log(
        `Points reverted for user ID ${trx.userId} in transaction ID ${trx.id}`
      );
    }

    // Anda dapat menambahkan logika tambahan sesuai kebutuhan bisnis Anda
  } catch (error) {
    console.error("Failed to revert seats and related data:", error);
    throw error; // Pastikan error dilempar agar transaksi dibatalkan
  }
}

cron.schedule("*/15 * * * * *", async () => {
  console.log("Running 2-hours check for pending transactions...");
  try {
    const now = new Date();
<<<<<<< HEAD
    // const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 1 * 60 * 1000);
=======
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    // const twoHoursAgo = new Date(now.getTime() - 1 * 60 * 1000); untuk mengecek saja
>>>>>>> dad058190e9e096515025f55d929a55b7f8ca180

    // Cari semua transaksi yang:
    //  1) Status = PENDING
    //  2) createdAt <= twoHoursAgo (sudah lewat 2 jam)
    //  3) paymentProof masih kosong ("" atau null)
    const transactions = await prisma.transaction.findMany({
      where: {
        status: TransactionStatus.PENDING,
        createdAt: { lte: twoHoursAgo },
        OR: [{ paymentProof: null }, { paymentProof: "" }],
      },
    });

    for (const trx of transactions) {
      await prisma.$transaction(async (tx) => {
        // Ubah status jadi CANCELED
        await tx.transaction.update({
          where: { id: trx.id },
          data: {
            status: TransactionStatus.CANCELED,
          },
        });

        // Kembalikan seat, dsb.
        await revertSeats(tx, trx);
        console.log(
          `Transaction ID ${trx.id} canceled due to 2 hours timeout.`
        );
      });
    }
  } catch (error) {
    console.error("Failed to handle 2-hours pending cancellation:", error);
  }
});

/**
 * Job 2: Cancel transaction after 3 days if status is AWAITING_APPROVAL or PENDING
 * Runs every day at 00:00.
 * Format cron: '0 0 * * *'
 */
// cron.schedule("*/15 * * * * **", async () => { untuk cek saja
cron.schedule("0 0 * * *", async () => {
  console.log("Running 3-days check for awaiting-approval transactions...");
  try {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    // const threeDaysAgo = new Date(now.getTime() - 1 * 60 * 1000); untuk cek saja

    // Cari transaksi yang sudah lewat 3 hari
    // dan statusnya AWAITING_APPROVAL atau PENDING
    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: { lte: threeDaysAgo },
        status: {
          in: [TransactionStatus.AWAITING_APPROVAL, TransactionStatus.PENDING],
        },
      },
    });

    for (const trx of transactions) {
      await prisma.$transaction(async (tx) => {
        // Ubah status jadi CANCELED
        await tx.transaction.update({
          where: { id: trx.id },
          data: {
            status: TransactionStatus.CANCELED,
          },
        });

        // Kembalikan seat, dsb.
        await revertSeats(tx, trx);
        console.log(
          `Transaction ID ${trx.id} canceled due to 3 days no organizer action.`
        );
      });
    }
  } catch (error) {
    console.error("Failed to handle 3-days approval cancellation:", error);
  }
});

/**
 * Fungsi tambahan atau konfigurasi lainnya dapat ditambahkan di sini.
 */

// Ekspor cron jobs agar bisa diinisialisasi dari tempat lain
export default cron;
