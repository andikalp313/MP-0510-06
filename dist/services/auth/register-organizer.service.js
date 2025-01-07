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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOrganizerService = void 0;
const argon2_1 = require("../../lib/argon2");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const registerOrganizerService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, organizerName, email, address, role, password } = body;
        const existingUser = yield prisma_1.default.user.findFirst({
            where: { email },
        });
        if (existingUser) {
            throw new Error("Email already exist");
        }
        const hashedPassword = yield (0, argon2_1.hashPassword)(password);
        const newUser = yield prisma_1.default.user.create({
            data: {
                name,
                organizerName,
                email,
                address,
                role,
                password: hashedPassword,
            },
        });
        return newUser;
    }
    catch (error) {
        throw error;
    }
});
exports.registerOrganizerService = registerOrganizerService;
