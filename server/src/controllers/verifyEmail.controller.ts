import {Request, Response} from 'express'
import sql from 'mssql'
import mssqlConfig from '../config/mssqlConfig';
import encryption from '../utils/encryption';
import emailSend from '../utils/emailSend';
import generateOTP from '../utils/generateOTP';
import IKorisnik from '../models/korisnik.interfact';

const verifyEmail = async (request: Request<{}, {}, {email: string}>, response: Response) => {
  const email = request.body.email;
  const encEmail = encryption(email);
  try {
    const otp = generateOTP();
    const pool = await sql.connect(mssqlConfig)
    const korisnik: IKorisnik = (await pool.request()
    .input('email', sql.NVarChar, encEmail)
    .query('select * from Korisnik where email=@email')).recordset[0] as IKorisnik;

    if(!korisnik){
      response.status(404).json({message: `Nije pronadjen niti jedan korisnički račun sa datim emailom`});
      return
    }
    const updateResult = (await pool.request()
    .input('id_korisnik', sql.Int, korisnik.id)
    .input('otp', sql.NVarChar, otp)
    .query('update Korisnik set otp=@otp where id=@id_korisnik'));
    const emailSenderInfo = !(await emailSend(email, 'Promena šifre za nalog na eKuvaru', `Poštovani/a korisniče/korisnice,<br><br>Ovim mejlom Vas obavještavamo da smo zaprimili Vaš zahtjev ta promjenu šifre Vašeg naloga. Unesite Vaš kod za promijenu šifre potom pratite dalja uputstva u aplikaciji. Vaš kod za promjenu lozinke je: <br><br><div style="font-size: 28px; margin: 12px 0; text-align: center"><strong> ${otp.match(/.{1,4}/g)?.join(" ")} </strong></div><br><span style="color: red">NAPOMENA: ne dijelite ovaj kod ni sa kim!!!</span><br><br>Srdačan pozdrav<br>Vaš eKuvar<br>P.S: Ne odgovarajte na ovaj mejl jer niko ne nadzire njegovm inbox`)).rejected

    response.status(200).json({emailSenderInfo});
    return

  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default verifyEmail