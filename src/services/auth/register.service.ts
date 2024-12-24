import { User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { hashPassword } from "../../lib/argon2";

export const registerService = async (body: User) => {
  try {
    const { name, email, role, password, referredBy } = body;

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

    const pointsExpiryDate = new Date();
    pointsExpiryDate.setMonth(pointsExpiryDate.getMonth() + 3);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
        referredBy: referredBy || null,
      },
    });

    if (referralOwner) {
      const couponExpiresAt = new Date();
      couponExpiresAt.setMonth(couponExpiresAt.getMonth() + 3);

      const newCoupon = await prisma.coupon.create({
        data: {
          discountValue: 10000,
          ownerId: newUser.id,
          expiresAt: couponExpiresAt,
        },
      });

      await prisma.user.update({
        where: { id: newUser.id },
        data: {
          discountValue: newCoupon.discountValue,
          couponsExpiryDate: newCoupon.expiresAt,
        },
      });
    }
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
          pointsExpiryDate: pointsExpiryDate,
        },
      });
    }
    return newUser;
  } catch (error) {
    throw error;
  }
};
