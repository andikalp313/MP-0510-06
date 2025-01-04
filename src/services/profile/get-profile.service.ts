import { prisma } from "../../lib/prisma";

export const getProfileService = async (userId: number) => {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID format. It must be a positive integer.");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  } catch (error) {
    throw new Error("Failed to fetch user profile. Please try again later.");
  }
};
