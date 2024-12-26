// const prisma = require("@prisma/client");
// const { addHours, addDays } = require("date-fns");

// interface CreateTransactionParams {
//   userId: number;
//   eventId: number;
//   qty: number;
//   points: number;
//   rewardId?: number;
//   voucherId?: number;
//   couponId?: number;
// }

// interface Transaction {
//   id: number;
//   userId: number;
//   eventId: number;
//   quantity: number;
//   pointsUsed: number;
//   status: string;
//   createdAt: Date;
//   expiresAt: Date;
// }

// async function createTransaction({
//   userId,
//   eventId,
//   qty,
//   points,
//   rewardId,
//   voucherId,
//   couponId,
// }: CreateTransactionParams): Promise<Transaction> {
//   return prisma.$transaction(async (prisma: any) => {
//     // Step 1: Create Transaction
//     const transaction: Transaction = await prisma.transaction.create({
//       data: {
//         userId,
//         eventId,
//         quantity: qty,
//         pointsUsed: points,
//         status: "PENDING",
//         createdAt: new Date(),
//         expiresAt: addHours(new Date(), 2),
//       },
//     });

//     // Step 2: Update Event Booked Seats
//     await prisma.event.update({
//       where: { id: eventId },
//       data: {
//         avaliableSeatsReguler: { decrement: qty },
//       },
//     });

//     // Step 3: Handle User Points
//     if (points > 0) {
//       await prisma.user.update({
//         where: { id: userId },
//         data: { points: { decrement: points } },
//       });
//     }

//     // Step 4: Handle Rewards
//     if (rewardId) {
//       await prisma.reward.update({
//         where: { id: rewardId },
//         data: { isUsed: true },
//       });
//     }

//     // Step 5: Handle Voucher/Coupon
//     if (voucherId) {
//       await prisma.voucher.update({
//         where: { id: voucherId },
//         data: { isUsed: true },
//       });
//     }
//     if (couponId) {
//       await prisma.coupon.update({
//         where: { id: couponId },
//         data: { isUsed: true },
//       });
//     }

//     // Step 6: Scheduler for 2 Hours
//     setTimeout(async () => {
//       const currentTransaction: Transaction | null =
//         await prisma.transaction.findUnique({ where: { id: transaction.id } });
//       if (currentTransaction && currentTransaction.status === "PENDING") {
//         await prisma.transaction.update({
//           where: { id: transaction.id },
//           data: { status: "CANCELED" },
//         });

//         await prisma.event.update({
//           where: { id: eventId },
//           data: {
//             avaliableSeatsReguler: { increment: qty },
//           },
//         });
//       }
//     }, 2 * 60 * 60 * 1000);

//     // Step 7: Scheduler for 1 Day
//     setTimeout(async () => {
//       const currentTransaction: Transaction | null =
//         await prisma.transaction.findUnique({ where: { id: transaction.id } });
//       if (
//         currentTransaction &&
//         currentTransaction.status === "AWAITING_ADMIN_CONFIRMATION"
//       ) {
//         await prisma.transaction.update({
//           where: { id: transaction.id },
//           data: { status: "CANCELED" },
//         });

//         await prisma.event.update({
//           where: { id: eventId },
//           data: {
//             avaliableSeatsReguler: { increment: qty },
//           },
//         });
//       }
//     }, 24 * 60 * 60 * 1000);

//     return transaction;
//   });
// }

// export default createTransaction;
