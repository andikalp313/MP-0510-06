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
exports.createVoucherController = void 0;
const create_voucher_service_1 = require("../services/voucher/create-voucher.service");
// import { Role } from "../../prisma/generated/client";
const createVoucherController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.user.id;
        const result = yield (0, create_voucher_service_1.createVoucherService)(req.body, userId);
        res.status(201).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.createVoucherController = createVoucherController;
// export const getVouchersController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = res.locals.user.id;
//     const result = await getVouchersService(userId);
//     res.status(200).send(result);
//   } catch (error) {
//     next(error);
//   }
// };
