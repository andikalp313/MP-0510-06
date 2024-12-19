import { prisma } from "../../lib/prisma";

export const getEventService = async (id: number) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    });
    if (!event) {
      throw new Error("Invalid blog id");
    }
    return event;
  } catch (error) {
    throw error;
  }
};
