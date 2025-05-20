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
const verifyUserIdentity = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { primarni_kod_oporavka, sekundarni_kod_oporavka } = request.body;
    try {
        const pool = yield mssql_1.default.connect(mssqlConfig_1.default);
        const deactivatedAccount = (yield pool.request()
            .input('pko', mssql_1.default.NVarChar, primarni_kod_oporavka)
            .input('sko', mssql_1.default.NVarChar, sekundarni_kod_oporavka)
            .query('select * from Ugaseni_nalozi where primarni_kod_oporavka=@pko and sekundarni_kod_oporavka=@sko')).recordset[0];
        if (!deactivatedAccount) {
            response.status(404).json({ message: `Niste unijeli ispravne kodove za oporavak naloga...` });
            return;
        }
        response.status(200).json({ status: 'succes' });
        return;
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interna greška na serveru', error });
        return;
    }
});
exports.default = verifyUserIdentity;
