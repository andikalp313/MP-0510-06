import { cloudinaryUpload } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";

interface CreateEventBody {
  title: string;
  description: string;
  priceReguler: number;
  priceVip: number;
  priceVvip: number;
  content: string;
  eventCategory: string; // --- Change this line
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
    // Validasi input sederhana
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
      priceReguler: Number(body.priceReguler), // Ubah dari string ke number
      priceVip: Number(body.priceVip), // Ubah dari string ke number
      priceVvip: Number(body.priceVvip), // Ubah dari string ke number
      avaliableSeatsReguler: Number(body.avaliableSeatsReguler), // Ubah dari string ke number
      avaliableSeatsVip: Number(body.avaliableSeatsVip), // Ubah dari string ke number
      avaliableSeatsVvip: Number(body.avaliableSeatsVvip), // Ubah dari string ke number
      startDate: new Date(body.startDate), // Ubah dari string ke Date
      endDate: new Date(body.endDate), // Ubah dari string ke Date
      thumbnail: secure_url,
      userId, // ID pengguna
    };

    // Buat data event baru
    return await prisma.event.create({
      data: eventData,
    });
  } catch (error) {
    throw new Error("Failed to create event");
  }
};
