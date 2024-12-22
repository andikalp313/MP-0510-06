"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voucher_controller_1 = require("../controller/voucher.controller");
const jwt_1 = require("../lib/jwt");
const router = (0, express_1.Router)();
router.post("/", jwt_1.verifyToken, voucher_controller_1.createVoucherController);
exports.default = router;
