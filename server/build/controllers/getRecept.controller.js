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
const getRecept = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    const cookie = (0, parseCookie_1.default)(request.headers.cookie);
    const token = cookie['token'];
    if (!token) {
        response.status(401).json({ message: 'Sesija je istekla' });
        return;
    }
    try {
        const queries = `
      select * from vw_Recept_Svi_Podaci where id = @id;
      select * from vw_Recept_Sastojak_Svi_Podaci where id_recept=@id;
      select vrijednost as ocjena from Ocjena where id_recept=@id and id_korisnik=@id_korisnik;
      select IIF(EXISTS(select * from Omiljeno where id_recept=@id and id_korisnik=@id_korisnik), 1, 0) as omiljen;
      select * from vw_Komentar_Svi_Podaci where id_recept=@id order by datum_objave desc;
    `;
        const decodedUser = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
        const pool = yield mssql_1.default.connect(mssqlConfig_1.default);
        const recordsets = (yield pool.request()
            .input('id', mssql_1.default.Int, Number(id))
            .input('id_korisnik', mssql_1.default.Int, Number(decodedUser.id))
            .query(queries)).recordsets;
        if (recordsets[0].length === 0) {
            response.status(404).json({ message: 'Recept nije pronađen' });
            return;
        }
        const recept = recordsets[0][0];
        const sastojci = recordsets[1];
        const ocjena = !!recordsets[2][0] ? recordsets[2][0].ocjena : null;
        const omiljen = !!recordsets[3][0].omiljen;
        const rawComments = recordsets[4];
        const komentari = rawComments.map(item => {
            return {
                id: item.id,
                autor: item.puno_ime,
                id_recept: item.id_recept,
                odgovor_na: item.odgovor_na,
                datum_objave: item.datum_objave,
                sadrzaj: item.sadrzaj,
                mojKomentar: item.id_korisnik === Number(decodedUser.id)
            };
        });
        response.status(200).json({ recept: {
                id: recept.id,
                korisnik: recept.korisnik,
                datum_kreiranja: recept.datum_kreiranja,
                naslov: recept.naslov,
                porcija: recept.porcija,
                opis: recept.opis,
                priprema: recept.priprema,
                prosjecna_ocjena: recept.prosjecna_ocjena,
                broj_ocjena: recept.broj_ocjena,
                broj_omiljenih: recept.broj_omiljenih,
                posno: recept.posno,
                vegansko: recept.vegansko,
                slatko: recept.slatko,
                mojRecept: recept.id_korisnik === Number(decodedUser.id),
            }, sastojci, ocjena: ocjena, omiljen, komentari, recordsets });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interna greška na serveru', error });
        return;
    }
});
exports.default = getRecept;
