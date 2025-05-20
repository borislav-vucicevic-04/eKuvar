import {Request, Response, Router} from 'express'
import sql from 'mssql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config/config';
import bcrypt from 'bcrypt';
import mssqlConfig from '../config/mssqlConfig';
import parseCookies from '../utils/parseCookie';
import encryption from '../utils/encryption';
import IKorisnik from '../models/korisnik.interfact';
import emailSend from '../utils/emailSend';
import generateRecoveryCode from '../utils/generateRecoveryCode';

interface IResponse {
  puno_ime: string,
  email: string,
  datum_registracije: string,
  poslednja_prijava: string
}
interface IError {
  errorCode: number,
  message: string
}

const deactiveAccount = async (request: Request<{}, {}, {email: string, lozinka: string, datum_gasenja: string}>, response: Response) => {
  const cookie = parseCookies(request.headers.cookie);
  const token = cookie['token'];
  const {email, lozinka, datum_gasenja} = request.body
  const encEmail = encryption(email);
  
  if(!token) {
    response.status(401).json({message: 'Sesija je istekla'});
    return
  }
  try {
    const decodedUser = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const pool = await sql.connect(mssqlConfig)
    const user = (await pool.request()
    .input('Email', sql.NVarChar, encEmail)
    .execute<IKorisnik>('KorisnikLogIn')).recordset[0];

    if (!user || !user.lozinka) {   
      const resObj: IError = {
        errorCode: 400,
        message: 'Email i/ili lozinka su neispravni'
      }     
      response.status(400).json(resObj);
      return;
    }
    
    const isMatch = await bcrypt.compare(lozinka, user.lozinka)
    
    if(!isMatch) {
      const resObj: IError = {
        errorCode: 400,
        message: 'Email i/ili lozinka su neispravni'
      }     
      response.status(400).json(resObj);
      return;
    }
    
    const primaryRecoveryCode = generateRecoveryCode(decodedUser.id)
    const secondaryRecoveryCode = generateRecoveryCode();
    const deactivatedAccount = (await pool.request()
    .input('id_korisnik', sql.Int, Number(decodedUser.id))
    .input('datum_gasenja', sql.DateTime2, datum_gasenja)
    .input('primarni_kod_oporavka', sql.NVarChar, primaryRecoveryCode)
    .input('sekundarni_kod_oporavka', sql.NVarChar, secondaryRecoveryCode)
    .execute('UgasiNalog')).recordset[0]

    const emailMessageBody = `Poštovani/a korisniče/korisnice, <br><br> Ovim mejlom Vas obavještavamo da smo zaprimili Vaš zahtjev za gašenje Vašeg eKuvar naloga. Napominjemo da su samo Vaši lični podaci obrisani iz naše baze podataka, te da su svi Vaši recepti, ocjene, komentari, i oznake omiljenih recepata, ostali u našoj bazi podataka<br><br>Napominjemo da uvijek imate mogućost oporavka Vašeg naloga kada god poželite. Dovoljno je da odete na stranicu za oporavak naloga u našoj aplikaciji, ispratite jednostvnu proceduru i oporavite Vaš nalog. <br><br>Kako biste mogli oporaviti Vaš nalog, potrebno je da unesete <strong>kodove za oporavak naloga</strong>. Zbog toga <strong><u>NESMIJETE OBRISATI OVAJ MEJL!</u></strong> Ovaj i samo ovaj mejl sadrži kodove za oporavak Vašeg naloga!<br><br>Vaši kodovi za oporavak:<ul> <li>Primarni kod za oporavak: <strong>${primaryRecoveryCode.match(/.{1,4}/g)?.join(' ')}</strong></li><li>Sekundarni kod za oporavak: <strong>${secondaryRecoveryCode.match(/.{1,4}/g)?.join(' ')}</strong></li></ul> Još jednom napominjemo da ne brišete ovaj mejl jer samo on sadrži Vaše kodove za oporavak naloga! Savjetujemo da napravite kopiju ovog mejla ili zapišete ove kodove na još nekom mjestu kako biste osigurali da ih ne izgubite!<br><br><span style="color: red">NAPOMENA: Obzirom da su ovi kodovi jedina potvrda Vašeg identiteta prilikom oporavka naloga, to ih čini neizmjerno povjerljivima! Postupajte sa njima kao sa istim!</span><br><br> Srdačan pozdrav<br>Vaš eKuvar<br>P.S: Neodgovarajte na ovaj mejl jer niko ne nadzire njegov inbox.`
    
    if(!deactivatedAccount) throw "";

    console.log(await emailSend(email, 'Zahtjev za deaktivaciju naloga', emailMessageBody))
    response.cookie('token', null, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax',
      maxAge: 1
    })
    response.status(200).json(deactivatedAccount);

  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

const deactiveAccountRoute = Router();

deactiveAccountRoute.post('/', deactiveAccount)

export default deactiveAccountRoute