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
const updateRecept = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = (0, parseCookie_1.default)(request.headers.cookie);
    const token = cookie['token'];
    const receptData = request.body.receptData;
    const sastojci = request.body.sastojci;
    if (!token) {
        response.status(401).json({ message: 'Sesija je istekla' });
        return;
    }
    try {
        const queryInserRecept = `
      update Recept
      set naslov=@naslov, porcija=@porcija, opis=@opis, priprema=@priprema, posno=@posno, vegansko=@vegansko, slatko=@slatko
      where id=@id_recept;
    `;
        const queryDeleteReceptSastojak = `
      delete from Recept_Sastojak
      where id_recept=@id_recept;
    `;
        const queryUpdateReceptSastojak = `
      insert into Recept_Sastojak
      values (@id_recept, @id_sastojak, @kolicina);
    `;
        const decodedUser = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
        const pool = yield mssql_1.default.connect(mssqlConfig_1.default);
        // editovanje podataka o receptu
        yield pool.request()
            .input('id_recept', mssql_1.default.Int, receptData.id)
            .input('naslov', mssql_1.default.NVarChar, receptData.naslov)
            .input('porcija', mssql_1.default.Int, receptData.porcija)
            .input('opis', mssql_1.default.NVarChar, receptData.opis)
            .input('priprema', mssql_1.default.NVarChar, receptData.priprema)
            .input('posno', mssql_1.default.Bit, Number(receptData.posno))
            .input('vegansko', mssql_1.default.Bit, Number(receptData.vegansko))
            .input('slatko', mssql_1.default.Bit, Number(receptData.slatko))
            .query(queryInserRecept);
        // brisanje sastojaka iz tabele Recept_Sastojak
        yield pool.request().input('id_recept', mssql_1.default.Int, receptData.id).query(queryDeleteReceptSastojak);
        // dodavanje sastojaka
        sastojci.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const result = (yield pool.request()
                .input('id_recept', mssql_1.default.Int, receptData.id)
                .input('id_sastojak', mssql_1.default.Int, item.id)
                .input('kolicina', mssql_1.default.NVarChar, item.kolicina)
                .query(queryUpdateReceptSastojak)).recordsets[0];
            return result;
        }));
        response.status(200).json({ updatedID: receptData.id });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interna greška na serveru', error });
        return;
    }
});
exports.default = updateRecept;
