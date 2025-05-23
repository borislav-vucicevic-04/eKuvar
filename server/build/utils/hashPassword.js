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
const config_1 = __importDefault(require("../config/config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Hashira lozinku koristeći asinhronu funkciju bcrypt.hash
        const hashedPassword = yield bcrypt_1.default.hash(data, config_1.default.BCRYPT_SALT);
        return hashedPassword;
    }
    catch (error) {
        console.error('Greška pri hashiranju lozinke:', error);
        throw error; // Bacanje greške ako nešto pođe po zlu
    }
});
exports.default = hashPassword;
