import {Request, Response} from 'express'
import sql from 'mssql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config/config';
import mssqlConfig from '../config/mssqlConfig';
import parseCookies from '../utils/parseCookie';
import IKorisnik from '../models/korisnik.interfact';
import decryption from '../utils/decryption';

const getKorisnik = async (request: Request, response: Response) => {
  const cookie = parseCookies(request.headers.cookie);
  const token = cookie['token'];
  
  if(!token) {
    response.status(401).json({message: 'Sesija je istekla'});
    return
  }
  try {
    const query = `
      select puno_ime, email, datum_registracije, poslednja_prijava from Korisnik  where id=@id;
    `;
    const decodedUser = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const pool = await sql.connect(mssqlConfig)
    const korisnik: any = ((await pool.request()
    .input('id', sql.Int, Number(decodedUser.id))
    .query(query)).recordsets as any)[0][0] as IKorisnik;
    const {puno_ime, email, datum_registracije, poslednja_prijava} = {...korisnik}
    response.status(200).json({puno_ime, datum_registracije, poslednja_prijava, email: decryption(email)})
  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default getKorisnik