import { cloudinaryUpload } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";

interface CreateEventBody {
  title: string;
  description: string;
  priceReguler: number;
  priceVip: number;
  priceVvip: number;
  content: string;
  eventCategory: string;
  startDate: Date;
  endDate: Date;
  avaliableSeatsReguler: number;
  avaliableSeatsVip: number;
  avaliableSeatsVvip: number;
  location: string;
}

export const createEventService = async (
  body: CreateEventBody,
  thumbnail: Express.Multer.File,
  userId: number
) => {
  try {
    if (!body.title || !thumbnail) {
      throw new Error("Title and thumbnail are required");
    }

    // Periksa apakah event  n  dengan judul yang sama sudah ada
    const existingEvent = await prisma.event.findFirst({
      where: { title: body.title },
    });

    if (existingEvent) {
      throw new Error("Title already in use");
    }

    // Upload thumbnail ke Cloudinary
    const { secure_url } = await cloudinaryUpload(thumbnail);

    // Parsing tipe data yang sesuai
    const eventData = {
      ...body,
      priceReguler: Number(body.priceReguler),
      priceVip: Number(body.priceVip),
      priceVvip: Number(body.priceVvip),
      avaliableSeatsReguler: Number(body.avaliableSeatsReguler),
      avaliableSeatsVip: Number(body.avaliableSeatsVip),
      avaliableSeatsVvip: Number(body.avaliableSeatsVvip),
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      thumbnail: secure_url,
      userId,
    };
    return await prisma.event.create({
      data: eventData,
    });
  } catch (error) {
    throw new Error("Failed to create event");
  }
};
