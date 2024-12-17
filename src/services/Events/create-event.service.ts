import { cloudinaryUpload } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";

interface CreateEventBody {
  title: string;
  description: string;
  price: number;
  content: string;
  eventCategory: string; // --- Change this line
  startDate: Date;
  endDate: Date;
  avaliableSeats: number;
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

    // Periksa apakah event dengan judul yang sama sudah ada
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
      price: Number(body.price), // Ubah dari string ke number
      avaliableSeats: Number(body.avaliableSeats), // Ubah dari string ke number
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
