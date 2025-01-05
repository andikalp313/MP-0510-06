import { prisma } from "../../lib/prisma";

export const getProfileService = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      // include: { : { select: { name: true } } },
    });
    if (!user) {
      throw new Error("Invalid user id");
    }
    return user;
  } catch (error) {
    throw error;
  }
};
