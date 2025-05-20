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
const mssqlConfig_1 = __importDefault(require("../config/mssqlConfig"));
const parseCookie_1 = __importDefault(require("../utils/parseCookie"));
const generateReceptReport = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = (0, parseCookie_1.default)(request.headers.cookie);
    const token = cookie['token'];
    const { id } = request.body;
    if (!token) {
        response.status(401).json({ message: 'Sesija je istekla' });
        return;
    }
    try {
        const pool = yield mssql_1.default.connect(mssqlConfig_1.default);
        const data = (yield pool.request()
            .input('id_recept', mssql_1.default.Int, Number(id))
            .query(`
      select * from Func_Izvjestaj_Recepta(@id_recept);
      select * from Func_Recept_Sve_Ocjene(@id_recept);
      select * from Func_Recept_Svi_Omiljeni(@id_recept);  
    `))
            .recordsets;
        const osnovni_podaci = data[0][0];
        const ocjene = data[1];
        const omiljeni = data[2];
        response.status(200).json({ osnovni_podaci, ocjene, omiljeni });
        return;
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interna greška na serveru', error });
        return;
    }
});
exports.default = generateReceptReport;
