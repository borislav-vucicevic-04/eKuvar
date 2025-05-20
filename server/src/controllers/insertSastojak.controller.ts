import {Request, Response} from 'express'
import sql from 'mssql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config/config';
import mssqlConfig from '../config/mssqlConfig';
import parseCookies from '../utils/parseCookie';

const insertSastojak = async (request: Request<{}, {}, {naziv: string}>, response: Response) => {
  const cookie = parseCookies(request.headers.cookie);
  const token = cookie['token'];
  const naziv = request.body.naziv;
  
  if(!token) {
    response.status(401).json({message: 'Sesija je istekla'});
    return
  }
  try {
    const query = `
      insert into Sastojak
      output inserted.*
      values (@naziv);
    `;
    const decodedUser = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const pool = await sql.connect(mssqlConfig)
    const inserted: any =  (((await pool.request()
    .input('naziv', sql.NVarChar, naziv)
    .query(query)).recordset) as any)[0]
    response.status(200).json(inserted)
  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default insertSastojak