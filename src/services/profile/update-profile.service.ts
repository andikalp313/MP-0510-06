import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

type UpdateUserPayload = {
  name?: string;
  email?: string;
  address?: string;
  profilePicture?: string;
};

export const updateUser = async (
  id: number,
  payload: UpdateUserPayload
): Promise<User> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...payload,
      },
    });

    return updatedUser;
  } catch (error) {
    throw new Error
  } finally {
    await prisma.$disconnect();
  }
};
