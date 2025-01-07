// services/userService.js
const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");
import { User } from "@prisma/client";

const prisma = new PrismaClient();

export const changePasswordService = async (
  userId: number,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<User> =>  {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await argon2.verify(user.password, oldPassword, confirmPassword);
  if (!isMatch) {
    throw new Error("Old password is incorrect");
  }

  const hashedPassword = await argon2.hash(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return user;
};

export default changePasswordService
