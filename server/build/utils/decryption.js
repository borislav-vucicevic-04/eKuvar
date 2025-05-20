"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const decryption = (encryptedData) => {
    const secret = crypto_js_1.default.enc.Hex.parse(config_1.default.CRYPTOJS_SECRET);
    const iv = crypto_js_1.default.enc.Hex.parse(config_1.default.CRYPTOJS_IV);
    const decrypted = crypto_js_1.default.AES.decrypt(encryptedData, secret, { iv: iv });
    return decrypted.toString(crypto_js_1.default.enc.Utf8);
};
exports.default = decryption;
