"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import {
//   createVoucherController,
//   getVouchersController,
// } from "../controllers/";
const jwt_1 = require("../lib/jwt");
const voucher_validator_1 = require("../validators/voucher.validator");
const voucher_controller_1 = require("../controller/voucher.controller");
const router = express_1.default.Router();
// router.get("/", verifyToken, checkUserRole, getVouchersController); // harus login (verify token) dulu utk get voucher agar user yg tk punya hak tdk bisa lihat voucher code
router.post("/", jwt_1.verifyToken, voucher_validator_1.validateCreateVoucher, voucher_controller_1.createVoucherController);
exports.default = router;
