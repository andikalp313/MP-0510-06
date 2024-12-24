"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerService = void 0;
const prisma_1 = require("../../lib/prisma");
const argon2_1 = require("../../lib/argon2");
const registerService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, role, password, referredBy } = body;
        const existingUser = yield prisma_1.prisma.user.findFirst({
            where: { email },
        });
        if (existingUser) {
            throw new Error("Email already exist");
        }
        const hashedPassword = yield (0, argon2_1.hashPassword)(password);
        let referralOwner = null;
        if (referredBy && referredBy.trim()) {
            referralOwner = yield prisma_1.prisma.user.findFirst({
                where: { referralCode: referredBy },
            });
            if (!referralOwner) {
                throw new Error("Invalid referral code");
            }
        }
        const pointsExpiryDate = new Date();
        pointsExpiryDate.setMonth(pointsExpiryDate.getMonth() + 3);
        const newUser = yield prisma_1.prisma.user.create({
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
            const newCoupon = yield prisma_1.prisma.coupon.create({
                data: {
                    discountValue: 10000,
                    ownerId: newUser.id,
                    expiresAt: couponExpiresAt,
                },
            });
            yield prisma_1.prisma.user.update({
                where: { id: newUser.id },
                data: {
                    discountValue: newCoupon.discountValue,
                    couponsExpiryDate: newCoupon.expiresAt,
                },
            });
        }
        if (referralOwner) {
            yield prisma_1.prisma.referralTracking.create({
                data: {
                    userId: referralOwner.id,
                    name: referralOwner.name,
                    referralCode: referredBy,
                    referTo: newUser.id,
                    referredName: newUser.name,
                },
            });
            yield prisma_1.prisma.user.update({
                where: { id: referralOwner.id },
                data: {
                    points: { increment: 10000 },
                    pointsExpiryDate: pointsExpiryDate,
                },
            });
        }
        return newUser;
    }
    catch (error) {
        throw error;
    }
});
exports.registerService = registerService;
