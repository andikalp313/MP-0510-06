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

    const referralOwner = await prisma.user.findFirst({
      where: { referralCode: referredBy },
    });

    if (!referralOwner) {
      throw new Error("Invalid referral code");
    }

    const referredByValue = body.referredBy

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        referredBy: referredByValue,
      },
    });

    if (referralOwner) {
      await prisma.referralTracking.create({
        data: {
          userId: referralOwner.id,
          name: referralOwner.name,
          referralCode: referredByValue,
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
