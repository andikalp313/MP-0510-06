import { PrismaClient, TransactionStatus } from "@prisma/client";
import prisma from "../../lib/prisma";

export const getReviewsByEvent = async (eventId: number) => {
  const reviews = await prisma.review.findMany({
    where: {
      eventId: eventId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profilPicture: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};
