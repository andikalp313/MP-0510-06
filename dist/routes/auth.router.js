"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
const auth_validator_1 = require("../validator/auth.validator");
const router = (0, express_1.Router)();
router.post("/register", auth_validator_1.validateRegister, auth_controller_1.registerController);
exports.default = router;
