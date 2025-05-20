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
const insertKomentar = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = (0, parseCookie_1.default)(request.headers.cookie);
    const token = cookie['token'];
    const { id_recept, odgovor_na, datum_objave, sadrzaj } = request.body;
    console.log(request.body);
    if (!token) {
        response.status(401).json({ message: 'Sesija je istekla' });
        return;
    }
    try {
        const query = `
      insert into Komentar
      output INSERTED.id
      values (@id_korisnik, @id_recept, @odgovor_na, @datum_objave, @sadrzaj);
    `;
        const decodedUser = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
        const pool = yield mssql_1.default.connect(mssqlConfig_1.default);
        const insertedID = (yield pool.request()
            .input('id_korisnik', mssql_1.default.Int, Number(decodedUser.id))
            .input('id_recept', mssql_1.default.Int, Number(id_recept))
            .input('odgovor_na', mssql_1.default.Int, odgovor_na)
            .input('datum_objave', mssql_1.default.DateTime2, datum_objave)
            .input('sadrzaj', mssql_1.default.NVarChar, sadrzaj)
            .query(query)).recordset[0].id;
        response.status(200).json({ insertedID });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interna greška na serveru', error });
        return;
    }
});
exports.default = insertKomentar;
