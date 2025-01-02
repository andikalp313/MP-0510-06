import { PrismaClient, TransactionStatus } from "@prisma/client";

const prisma = new PrismaClient();

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
