// src/services/eventService.ts

import { prisma } from "../../lib/prisma";

export const getEventService = async (id: number) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true },
        },
        vouchers: {
          select: { voucherCode: true },
        },

        reviews: {
          include: {
            user: {
              select: {
                name: true,
                profilPicture: true, // Jika Anda memiliki field profilPicture
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new Error("Invalid event id");
    }

    // Menghitung rata-rata rating dan jumlah ulasan
    const ratings = event.reviews.map((review) => review.rating);
    const totalReviews = ratings.length;
    const averageRating =
      totalReviews > 0 ? ratings.reduce((a, b) => a + b, 0) / totalReviews : 0;

    // Menambahkan informasi rating ke objek event
    return {
      ...event,
      averageRating: averageRating.toFixed(1), // Rata-rata rating dengan 1 desimal
      totalReviews,
    };
  } catch (error) {
    console.error("Error in getEventService:", error);
    throw error;
  }
};
