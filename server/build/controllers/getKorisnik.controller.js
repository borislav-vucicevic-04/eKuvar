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
const mssql_1 = __importDefault(require("mssql"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const mssqlConfig_1 = __importDefault(require("../config/mssqlConfig"));
const parseCookie_1 = __importDefault(require("../utils/parseCookie"));
const decryption_1 = __importDefault(require("../utils/decryption"));
const getKorisnik = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = (0, parseCookie_1.default)(request.headers.cookie);
    const token = cookie['token'];
    if (!token) {
        response.status(401).json({ message: 'Sesija je istekla' });
        return;
    }
    try {
        const query = `
      select puno_ime, email, datum_registracije, poslednja_prijava from Korisnik  where id=@id;
    `;
        const decodedUser = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
        const pool = yield mssql_1.default.connect(mssqlConfig_1.default);
        const korisnik = (yield pool.request()
            .input('id', mssql_1.default.Int, Number(decodedUser.id))
            .query(query)).recordsets[0][0];
        const { puno_ime, email, datum_registracije, poslednja_prijava } = Object.assign({}, korisnik);
        response.status(200).json({ puno_ime, datum_registracije, poslednja_prijava, email: (0, decryption_1.default)(email) });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interna greška na serveru', error });
        return;
    }
});
exports.default = getKorisnik;
