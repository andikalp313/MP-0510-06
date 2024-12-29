"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = require("../lib/jwt");
const transaction_controller_1 = require("../controller/transaction.controller");
const router = (0, express_1.Router)();
router.post("/create", jwt_1.verifyToken, transaction_controller_1.createTransactionController);
exports.default = router;
