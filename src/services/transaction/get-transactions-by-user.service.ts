import prisma from "../../lib/prisma";

export const getTransactionsByUserService = async (userId: number) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        event: {
          userId: userId, 
        },
      },
      include: {
        user: {
          select: {
            name: true, 
          },
        },
        event: {
          select: {
            title: true, 
          },
        },
      },
    });

    return transactions;
  } catch (error) {
    throw new Error;
  }
};
