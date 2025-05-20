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
const encryption_1 = __importDefault(require("../utils/encryption"));
const hashPassword_1 = __importDefault(require("../utils/hashPassword"));
const setNewPassword = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, lozinka } = request.body;
    const encEmail = (0, encryption_1.default)(email);
    const hasedLozinka = (yield (0, hashPassword_1.default)(lozinka)).toString();
    try {
        const pool = yield mssql_1.default.connect(mssqlConfig_1.default);
        const result = (yield pool.request()
            .input('email', mssql_1.default.NVarChar, encEmail)
            .input('otp', mssql_1.default.NVarChar, otp)
            .input('lozinka', mssql_1.default.NVarChar, hasedLozinka)
            .query(`
      update Korisnik
      set lozinka=@lozinka, otp=NULL
      where email=@email and otp=@otp  
    `)).rowsAffected;
        response.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interna greška na serveru', error });
        return;
    }
});
exports.default = setNewPassword;
