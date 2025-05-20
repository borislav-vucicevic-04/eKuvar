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
const encryption_1 = __importDefault(require("../utils/encryption"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const hashPassword_1 = __importDefault(require("../utils/hashPassword"));
const signUpRoute = (0, express_1.Router)();
const createUserAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { puno_ime, email, lozinka, datum_registracije, poslednja_prijava } = request.body;
    try {
        const encEmail = (0, encryption_1.default)(email).toString();
        const hashed = (yield (0, hashPassword_1.default)(lozinka)).toString();
        const pool = yield mssql_1.default.connect(mssqlConfig_1.default);
        const result = yield pool.request()
            .input('puno_ime', mssql_1.default.NVarChar, puno_ime)
            .input('email', mssql_1.default.NVarChar, encEmail)
            .input('lozinka', mssql_1.default.NVarChar, hashed)
            .input('datum_registracije', mssql_1.default.DateTime2, datum_registracije)
            .input('poslednja_prijava', mssql_1.default.DateTime2, poslednja_prijava)
            .output('id_korisnika', mssql_1.default.Int)
            .execute('KorisnikSignUp');
        const token = (0, generateToken_1.default)(result.output.id_korisnika.toString());
        response.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        response.status(200).json({
            puno_ime: puno_ime,
            datum_registracije: datum_registracije,
            poslednja_prijava: poslednja_prijava
        });
        return;
    }
    catch (error) {
        // Provjera da li je greška iz trigera (RAISERROR)
        if (error instanceof mssql_1.default.RequestError) {
            console.log(error);
            response.status(400).json();
            return;
        }
        console.log(error);
        response.status(500).json({ message: 'Interna greška na serveru', error });
        return;
    }
});
signUpRoute.post('/', createUserAccount);
exports.default = signUpRoute;
