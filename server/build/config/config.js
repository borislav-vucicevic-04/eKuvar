"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    APP_PORT: Number(process.env.APP_PORT) || 3000,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_SERVER: process.env.DB_SERVER,
    DB_NAME: process.env.DB_NAME,
    DB_SERVER_PORT: Number(process.env.DB_SERVER_PORT),
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    CRYPTOJS_SECRET: process.env.CRYPTOJS_SECRET,
    CRYPTOJS_IV: process.env.CRYPTOJS_IV,
    BCRYPT_SALT: Number(process.env.BCRYPT_SALT) || 10,
    GMAIL_HOST: process.env.GMAIL_HOST,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASS: process.env.GMAIL_PASS
};
exports.default = config;
