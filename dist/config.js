"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_CLOUD_NAME = exports.JWT_SECRET_FORGOT_PASSWORD = exports.JWT_SECRET = exports.PORT = exports.BASE_URL_FE = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.BASE_URL_FE = process.env.BASE_URL_FE;
exports.PORT = process.env.PORT;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_SECRET_FORGOT_PASSWORD = process.env.JWT_SECRET_FORGOT_PASSWORD;
exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
=======
exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT;
>>>>>>> 24d487e0316c5523ee67aff25b5531fac2c875b4
