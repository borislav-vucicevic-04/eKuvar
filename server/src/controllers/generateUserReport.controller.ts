import {Request, Response} from 'express'
import sql from 'mssql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config/config';
import mssqlConfig from '../config/mssqlConfig';
import parseCookies from '../utils/parseCookie';

const generateUserReport = async (request: Request, response: Response) => {
  const cookie = parseCookies(request.headers.cookie)
  const token = cookie['token'];
  
  if(!token) {
    response.status(401).json({message: 'Sesija je istekla'});
    return
  }
  try {
    const decodedUser = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const pool = await sql.connect(mssqlConfig)
    const userData = (await pool.request()
    .input('id_korisnik', sql.Int, Number(decodedUser.id))
    .query('select * from Func_Izvjestaj_Korisnika(@id_korisnik)'))
    .recordset[0];
    const result: any = (await pool.request()
    .input('id_korisnik', sql.Int, Number(decodedUser.id))
    .query(`
      select * from [dbo].Func_Moje_Ocjene(@id_korisnik);
      select id, naslov, korisnik as autor from [dbo].Func_Omiljeni_Recepti(@id_korisnik);
      select * from [dbo].func_Moji_Recepti(@id_korisnik);
    `)).recordsets

    const moje_ocjene = result[0];
    const moji_omiljeni = result[1];
    const moji_recepti = result[2];
    response.status(200).json({...userData, moje_ocjene, moji_omiljeni, moji_recepti});
    return;
  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default generateUserReport