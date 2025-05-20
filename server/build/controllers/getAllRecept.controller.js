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
const POREDAJ_PO_KOLONAMA = [
    'naslov',
    'korisnik',
    'datum_kreiranja',
    'porcija',
    'prosjecna_ocjena'
];
const POREDAK = ['asc', 'desc'];
const getAllRecept = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cookie = (0, parseCookie_1.default)(request.headers.cookie);
    const token = cookie['token'];
    const filter = request.body;
    if (!token) {
        response.status(401).json({ message: 'Sesija je istekla' });
        return;
    }
    try {
        const sortirajPo = POREDAJ_PO_KOLONAMA.includes(filter.sortirajPo) ? filter.sortirajPo : 'prosjecna_ocjena';
        const poredak = POREDAK.includes(filter.poredak) ? filter.poredak : 'desc';
        const decodedUser = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
        const pool = yield mssql_1.default.connect(mssqlConfig_1.default);
        const rawData = (yield pool.request()
            .input('naslov', mssql_1.default.NVarChar, (_a = filter.naslov) !== null && _a !== void 0 ? _a : null)
            .input('autor', mssql_1.default.NVarChar, filter.korisnik)
            .input('datum_kreiranja_min', mssql_1.default.DateTime2, filter.datum_kreiranja_min)
            .input('datum_kreiranja_max', mssql_1.default.DateTime2, filter.datum_kreiranja_max)
            .input('porcija_min', mssql_1.default.TinyInt, filter.porcija_min)
            .input('porcija_max', mssql_1.default.TinyInt, filter.porcija_max)
            .input('prosjecna_ocjena_min', mssql_1.default.Decimal(4, 2), filter.prosjecna_ocjena_min)
            .input('prosjecna_ocjena_max', mssql_1.default.Decimal(4, 2), filter.prosjecna_ocjena_max)
            .input('posno', mssql_1.default.Bit, filter.posno === null ? null : Number(filter.posno))
            .input('vegansko', mssql_1.default.Bit, filter.vegansko === null ? null : Number(filter.vegansko))
            .input('slatko', mssql_1.default.Bit, filter.slatko === null ? null : Number(filter.slatko))
            .query(`
      SELECT * FROM Func_Filtriraj_Recepte(
        @naslov, @autor, @datum_kreiranja_min, @datum_kreiranja_max, @porcija_min, @porcija_max, 
        @prosjecna_ocjena_min, @prosjecna_ocjena_max, @posno, @vegansko, @slatko) 
        order by ${sortirajPo} ${poredak}`))
            .recordsets[0];
        const data = rawData.map((item) => {
            return {
                id: item.id,
                korisnik: item.korisnik,
                datum_kreiranja: item.datum_kreiranja,
                naslov: item.naslov,
                porcija: item.porcija,
                opis: item.opis,
                priprema: item.priprema,
                prosjecna_ocjena: item.prosjecna_ocjena,
                broj_ocjena: item.broj_ocjena,
                broj_omiljenih: item.broj_omiljenih,
                posno: item.posno,
                vegansko: item.vegansko,
                slatko: item.slatko,
                mojRecept: item.id_korisnik === Number(decodedUser.id)
            };
        });
        response.status(200).json({ recepti: data });
        return;
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interna greška na serveru', error });
        return;
    }
});
exports.default = getAllRecept;
