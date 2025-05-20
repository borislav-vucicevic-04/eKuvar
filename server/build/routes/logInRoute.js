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
const express_1 = require("express");
const mssql_1 = __importDefault(require("mssql"));
const mssqlConfig_1 = __importDefault(require("../config/mssqlConfig"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const encryption_1 = __importDefault(require("../utils/encryption"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const logInRoute = (0, express_1.Router)();
const authentificateUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, lozinka } = request.body;
        const pool = mssql_1.default.connect(mssqlConfig_1.default);
        const encEmail = (0, encryption_1.default)(email);
        const result = (yield pool).request()
            .input('Email', mssql_1.default.NVarChar, encEmail)
            .execute('KorisnikLogIn');
        const user = (yield result).recordset[0];
        if (!user || !user.lozinka) {
            const resObj = {
                errorCode: 401,
                message: 'Email i/ili lozinka su neispravni'
            };
            response.status(401).json(resObj);
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(lozinka, user.lozinka);
        if (!isMatch) {
            const resObj = {
                errorCode: 401,
                message: 'Email i/ili lozinka su neispravni'
            };
            response.status(401).json(resObj);
            return;
        }
        // Autentifikacija uspješna
        const token = (0, generateToken_1.default)(user.id.toString());
        response.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        response.status(200).json({
            puno_ime: user.puno_ime,
            datum_registracije: user.datum_registracije,
            poslednja_prijava: user.poslednja_prijava
        });
        return;
    }
    catch (error) {
        console.error('Greška pri logovanju:', error);
        response.status(500).json({ message: 'Greška na serveru.', error });
        return;
    }
});
logInRoute.post('/', authentificateUser);
exports.default = logInRoute;
