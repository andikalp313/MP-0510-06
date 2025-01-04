// src/cronJobs.ts

import cron from "node-cron";
import { PrismaClient, TransactionStatus } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Fungsi helper untuk mengembalikan seats, vouchers, coupons, poin pengguna, dll.
 */
async function revertSeats(trx: any) {
  try {
    // Mulai transaksi database untuk memastikan konsistensi
    await prisma.$transaction(async (prisma) => {
      // 1. Mengembalikan Kursi
      const event = await prisma.event.findUnique({
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
        await prisma.event.update({
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
        const voucher = await prisma.voucher.findUnique({
          where: { id: trx.voucherId },
        });

        if (voucher) {
          await prisma.voucher.update({
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
        const coupon = await prisma.coupon.findUnique({
          where: { id: trx.couponId },
        });

        if (coupon) {
          await prisma.coupon.update({
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
        await prisma.user.update({
          where: { id: trx.userId },
          data: {
            points: {
              increment: trx.pointsUsed,
            },
            pointsIsUsed: false, // Sesuaikan dengan logika bisnis Anda
            pointsExpiryDate: null, // Sesuaikan dengan logika bisnis Anda
          },
        });
        console.log(
          `Points reverted for user ID ${trx.userId} in transaction ID ${trx.id}`
        );
      }

      // Anda dapat menambahkan logika tambahan sesuai kebutuhan bisnis Anda
    });
  } catch (error) {
    console.error("Failed to revert seats and related data:", error);
  }
}

/**
 * Job 1: Cancel transaction after 2 hours if paymentProof is still empty or status is PENDING
 * Runs every 10 minutes.
 * Format cron: '*/
cron.schedule("*/10 * * * *", async () => {
  console.log("Running 2-hours check for pending transactions...");
  try {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

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
      await prisma.$transaction(async (prisma) => {
        // Ubah status jadi CANCELED
        await prisma.transaction.update({
          where: { id: trx.id },
          data: {
            status: TransactionStatus.CANCELED,
          },
        });

        // Kembalikan seat, dsb.
        await revertSeats(trx);
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
cron.schedule("0 0 * * *", async () => {
  console.log("Running 3-days check for awaiting-approval transactions...");
  try {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

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
      await prisma.$transaction(async (prisma) => {
        await prisma.transaction.update({
          where: { id: trx.id },
          data: {
            status: TransactionStatus.CANCELED,
          },
        });

        // Kembalikan seat, dsb.
        await revertSeats(trx);
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

// Eksekusi fungsi secara langsung jika diperlukan (misalnya untuk testing)
// (async () => {
//   await revertSeats({ /* Mock transaction object */ });
// })();

export default cron;
