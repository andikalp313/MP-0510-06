import { PrismaClient, TransactionStatus } from "@prisma/client";
import prisma from "../../lib/prisma";

interface CreateReviewInput {
  userId: number;
  eventId: number;
  rating: number;
  comment: string;
}

export const createReview = async (data: CreateReviewInput) => {
  const { userId, eventId, rating, comment } = data;

  // Periksa apakah pengguna telah menghadiri acara (transaksi sukses)
  const transaction = await prisma.transaction.findFirst({
    where: {
      userId: userId,
      eventId: eventId,
      status: TransactionStatus.SUCCESS,
    },
  });

  if (!transaction) {
    throw new Error(
      "Anda belum menghadiri acara ini atau transaksi belum berhasil."
    );
  }

  // Ambil informasi acara untuk memeriksa tanggal akhir
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      endDate: true,
    },
  });

  if (!event) {
    throw new Error("Acara tidak ditemukan.");
  }

  const currentDate = new Date();
  const eventEndDate = new Date(event.endDate);

  if (currentDate < eventEndDate) {
    throw new Error(
      "Anda hanya dapat memberikan ulasan setelah acara berakhir."
    );
  }

  // Periksa apakah pengguna sudah memberikan ulasan untuk acara ini
  const existingReview = await prisma.review.findFirst({
    where: {
      userId: userId,
      eventId: eventId,
    },
  });

  if (existingReview) {
    throw new Error("Anda sudah memberikan ulasan untuk acara ini.");
  }

  // Buat ulasan baru
  const review = await prisma.review.create({
    data: {
      userId,
      eventId,
      rating,
      comment,
    },
  });

  return review;
};
