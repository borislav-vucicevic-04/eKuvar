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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mssqlConfig_1 = __importDefault(require("../config/mssqlConfig"));
const parseCookie_1 = __importDefault(require("../utils/parseCookie"));
const encryption_1 = __importDefault(require("../utils/encryption"));
const emailSend_1 = __importDefault(require("../utils/emailSend"));
const generateRecoveryCode_1 = __importDefault(require("../utils/generateRecoveryCode"));
const deactiveAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const cookie = (0, parseCookie_1.default)(request.headers.cookie);
    const token = cookie['token'];
    const { email, lozinka, datum_gasenja } = request.body;
    const encEmail = (0, encryption_1.default)(email);
    if (!token) {
        response.status(401).json({ message: 'Sesija je istekla' });
        return;
    }
    try {
        const decodedUser = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
        const pool = yield mssql_1.default.connect(mssqlConfig_1.default);
        const user = (yield pool.request()
            .input('Email', mssql_1.default.NVarChar, encEmail)
            .execute('KorisnikLogIn')).recordset[0];
        if (!user || !user.lozinka) {
            const resObj = {
                errorCode: 400,
                message: 'Email i/ili lozinka su neispravni'
            };
            response.status(400).json(resObj);
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(lozinka, user.lozinka);
        if (!isMatch) {
            const resObj = {
                errorCode: 400,
                message: 'Email i/ili lozinka su neispravni'
            };
            response.status(400).json(resObj);
            return;
        }
        const primaryRecoveryCode = (0, generateRecoveryCode_1.default)(decodedUser.id);
        const secondaryRecoveryCode = (0, generateRecoveryCode_1.default)();
        const deactivatedAccount = (yield pool.request()
            .input('id_korisnik', mssql_1.default.Int, Number(decodedUser.id))
            .input('datum_gasenja', mssql_1.default.DateTime2, datum_gasenja)
            .input('primarni_kod_oporavka', mssql_1.default.NVarChar, primaryRecoveryCode)
            .input('sekundarni_kod_oporavka', mssql_1.default.NVarChar, secondaryRecoveryCode)
            .execute('UgasiNalog')).recordset[0];
        const emailMessageBody = `Poštovani/a korisniče/korisnice, <br><br> Ovim mejlom Vas obavještavamo da smo zaprimili Vaš zahtjev za gašenje Vašeg eKuvar naloga. Napominjemo da su samo Vaši lični podaci obrisani iz naše baze podataka, te da su svi Vaši recepti, ocjene, komentari, i oznake omiljenih recepata, ostali u našoj bazi podataka<br><br>Napominjemo da uvijek imate mogućost oporavka Vašeg naloga kada god poželite. Dovoljno je da odete na stranicu za oporavak naloga u našoj aplikaciji, ispratite jednostvnu proceduru i oporavite Vaš nalog. <br><br>Kako biste mogli oporaviti Vaš nalog, potrebno je da unesete <strong>kodove za oporavak naloga</strong>. Zbog toga <strong><u>NESMIJETE OBRISATI OVAJ MEJL!</u></strong> Ovaj i samo ovaj mejl sadrži kodove za oporavak Vašeg naloga!<br><br>Vaši kodovi za oporavak:<ul> <li>Primarni kod za oporavak: <strong>${(_a = primaryRecoveryCode.match(/.{1,4}/g)) === null || _a === void 0 ? void 0 : _a.join(' ')}</strong></li><li>Sekundarni kod za oporavak: <strong>${(_b = secondaryRecoveryCode.match(/.{1,4}/g)) === null || _b === void 0 ? void 0 : _b.join(' ')}</strong></li></ul> Još jednom napominjemo da ne brišete ovaj mejl jer samo on sadrži Vaše kodove za oporavak naloga! Savjetujemo da napravite kopiju ovog mejla ili zapišete ove kodove na još nekom mjestu kako biste osigurali da ih ne izgubite!<br><br><span style="color: red">NAPOMENA: Obzirom da su ovi kodovi jedina potvrda Vašeg identiteta prilikom oporavka naloga, to ih čini neizmjerno povjerljivima! Postupajte sa njima kao sa istim!</span><br><br> Srdačan pozdrav<br>Vaš eKuvar<br>P.S: Neodgovarajte na ovaj mejl jer niko ne nadzire njegov inbox.`;
        if (!deactivatedAccount)
            throw "";
        console.log(yield (0, emailSend_1.default)(email, 'Zahtjev za deaktivaciju naloga', emailMessageBody));
        response.cookie('token', null, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1
        });
        response.status(200).json(deactivatedAccount);
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interna greška na serveru', error });
        return;
    }
});
const deactiveAccountRoute = (0, express_1.Router)();
deactiveAccountRoute.post('/', deactiveAccount);
exports.default = deactiveAccountRoute;
