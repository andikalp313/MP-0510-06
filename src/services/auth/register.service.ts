import { User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { hashPassword } from "../../lib/argon2";

export const registerService = async (body: User) => {
  try {
    const { name, email, password, referredBy } = body;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already exist");
    }

    const hashedPassword = await hashPassword(password);

    let referralOwner = null;

    if (referredBy && referredBy.trim()) {
      referralOwner = await prisma.user.findFirst({
        where: { referralCode: referredBy },
      });

      if (!referralOwner) {
        throw new Error("Invalid referral code");
      }
    }
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        referredBy: referredBy || null,
      },
    });

    if (referralOwner) {
      await prisma.referralTracking.create({
        data: {
          userId: referralOwner.id,
          name: referralOwner.name,
          referralCode: referredBy,
          referTo: newUser.id,
          referredName: newUser.name,
        },
      });

      await prisma.user.update({
        where: { id: referralOwner.id },
        data: {
          points: { increment: 10000 },
        },
      });
    }
    return newUser;
  } catch (error) {
    throw error;
  }
};
