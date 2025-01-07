import { User } from "@prisma/client";

import { hashPassword } from "../../lib/argon2";
import prisma from "../../lib/prisma";

export const registerOrganizerService = async (body: User) => {
  try {
    const { name, organizerName, email, address, role, password } = body;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already exist");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        organizerName,
        email,
        address,
        role,
        password: hashedPassword,
      },
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};
