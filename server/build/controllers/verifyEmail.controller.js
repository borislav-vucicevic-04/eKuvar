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
const emailSend_1 = __importDefault(require("../utils/emailSend"));
const generateOTP_1 = __importDefault(require("../utils/generateOTP"));
const verifyEmail = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = request.body.email;
    const encEmail = (0, encryption_1.default)(email);
    try {
        const otp = (0, generateOTP_1.default)();
        const pool = yield mssql_1.default.connect(mssqlConfig_1.default);
        const korisnik = (yield pool.request()
            .input('email', mssql_1.default.NVarChar, encEmail)
            .query('select * from Korisnik where email=@email')).recordset[0];
        if (!korisnik) {
            response.status(404).json({ message: `Nije pronadjen niti jedan korisnički račun sa datim emailom` });
            return;
        }
        const updateResult = (yield pool.request()
            .input('id_korisnik', mssql_1.default.Int, korisnik.id)
            .input('otp', mssql_1.default.NVarChar, otp)
            .query('update Korisnik set otp=@otp where id=@id_korisnik'));
        const emailSenderInfo = !(yield (0, emailSend_1.default)(email, 'Promena šifre za nalog na eKuvaru', `Poštovani/a korisniče/korisnice,<br><br>Ovim mejlom Vas obavještavamo da smo zaprimili Vaš zahtjev ta promjenu šifre Vašeg naloga. Unesite Vaš kod za promijenu šifre potom pratite dalja uputstva u aplikaciji. Vaš kod za promjenu lozinke je: <br><br><div style="font-size: 28px; margin: 12px 0; text-align: center"><strong> ${(_a = otp.match(/.{1,4}/g)) === null || _a === void 0 ? void 0 : _a.join(" ")} </strong></div><br><span style="color: red">NAPOMENA: ne dijelite ovaj kod ni sa kim!!!</span><br><br>Srdačan pozdrav<br>Vaš eKuvar<br>P.S: Ne odgovarajte na ovaj mejl jer niko ne nadzire njegovm inbox`)).rejected;
        response.status(200).json({ emailSenderInfo });
        return;
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interna greška na serveru', error });
        return;
    }
});
exports.default = verifyEmail;
