import { prisma } from "../../lib/prisma";

interface CreateVoucherBody {
  eventId: number;
  code: string;
  discountValue: number;
  startDate: Date;
  endDate: Date;
}

export const createVoucherService = async (body: CreateVoucherBody) => {
  try {
    // Validasi input sederhana
    if (
      !body.eventId ||
      !body.code ||
      !body.discountValue ||
      !body.startDate ||
      !body.endDate
    ) {
      throw new Error("All fields are required");
    }

    // Buat data voucher baru
    const voucher = await prisma.voucher.create({
      data: {
        eventId: body.eventId,
        code: body.code,
        discountValue: body.discountValue,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    });

    return voucher;
  } catch (error) {
    throw new Error("Failed to create voucher");
  }
};
