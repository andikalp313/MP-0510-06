import cron from "node-cron";
import { PrismaClient, TransactionStatus } from "@prisma/client";

const prisma = new PrismaClient();

// /**
//  * Job 1: Cancel transaction after 2 hours if paymentProof is still empty or status is PENDING
//  * Runs every 10 minutes (misal, ganti sesuai kebutuhan).
//  * Format cron: '*/10 * * * *' -> setiap 10 menit/
cron.schedule("*/10 * * * *", async () => {
  console.log("Running 2-hours check for pending transactions...");
  try {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    // Cari semua transaksi yang:
    //  1) Status = PENDING
    //  2) createdAt <= twoHoursAgo (sudah lewat 2 jam)
    //  3) paymentProof masih kosong ("" atau null, )
    const transactions = await prisma.transaction.findMany({
      where: {
        status: TransactionStatus.PENDING,
        createdAt: { lte: twoHoursAgo },
        OR: [{ paymentProof: null }, { paymentProof: "" }],
      },
    });

    for (const trx of transactions) {
      // Ubah status jadi CANCELED
      await prisma.transaction.update({
        where: { id: trx.id },
        data: {
          status: TransactionStatus.CANCELED,
        },
      });

      // Kembalikan seat, dsb.
      await revertSeats(trx);
      console.log(`Transaction ID ${trx.id} canceled due to 2 hours timeout.`);
    }
  } catch (error) {
    console.error("Failed to handle 2-hours pending cancellation:", error);
  }
});

/**
 * Job 2: Cancel transaction after 3 days if status is AWAITING_APPROVAL (atau PENDING)
 * Runs every day at 00:00
 * Format cron: '0 0 * * *'
 */
cron.schedule("0 0 * * *", async () => {
  console.log("Running 3-days check for awaiting-approval transactions...");
  try {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    // Cari transaksi yang sudah lewat 3 hari
    // dan statusnya AWAITING_APPROVAL atau PENDING (tergantung alur)
    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: { lte: threeDaysAgo },
        status: {
          in: [TransactionStatus.AWAITING_APPROVAL, TransactionStatus.PENDING],
        },
      },
    });

    for (const trx of transactions) {
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
    }
  } catch (error) {
    console.error("Failed to handle 3-days approval cancellation:", error);
  }
});

/**
 * Fungsi helper untuk kembalikan seats
 * (Bisa juga menambah logic untuk mengembalikan voucher, coupon, poin user, dsb.)
 */
async function revertSeats(trx: any) {
  try {
    // Ambil info event terkait
    const event = await prisma.event.findUnique({
      where: { id: trx.eventId },
    });
    if (!event) return;

    // Pastikan transaction punya kolom ticketType (REGULER, VIP, VVIP)
    // agar tahu seat mana yang harus dikembalikan
    if (trx.ticketType === "REGULER") {
      await prisma.event.update({
        where: { id: trx.eventId },
        data: {
          avaliableSeatsReguler: {
            increment: trx.quantity,
          },
        },
      });
    } else if (trx.ticketType === "VIP") {
      await prisma.event.update({
        where: { id: trx.eventId },
        data: {
          avaliableSeatsVip: {
            increment: trx.quantity,
          },
        },
      });
    } else if (trx.ticketType === "VVIP") {
      await prisma.event.update({
        where: { id: trx.eventId },
        data: {
          avaliableSeatsVvip: {
            increment: trx.quantity,
          },
        },
      });
    }
    console.log(`Seats reverted for transaction ID ${trx.id}`);
  } catch (error) {
    console.error("Failed to revert seats:", error);
  }
}
