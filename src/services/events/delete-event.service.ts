import prisma from "../../lib/prisma";

export const deleteEventService = async (id: number, userId: number) => {
  try {
    const event = await prisma.event.findFirst({
      where: { id },
    });
    if (!event) {
      throw new Error("Invalid event id");
    }

    if (event.userId !== userId) {
      throw new Error("Unauthorized");
    }
    await prisma.event.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: "Delete event success." };
  } catch (error) {
    throw error;
  }
};
