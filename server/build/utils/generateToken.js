"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const generateToken = (userID) => {
    const secret = config_1.default.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET nije definisan u .env fajlu");
    }
    if (!config_1.default.JWT_EXPIRES_IN) {
        throw new Error("JWT_EXPIRES_IN nije definisan u .env fajlu");
    }
    const token = jsonwebtoken_1.default.sign({ id: userID }, secret, {
        expiresIn: '7d'
    });
    return token;
};
exports.default = generateToken;
