import {Request, Response} from 'express'
import sql from 'mssql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config/config';
import mssqlConfig from '../config/mssqlConfig';
import parseCookies from '../utils/parseCookie';

const deleteOmiljeno = async (request: Request<{}, {}, {id_recept: string}>, response: Response) => {
  const cookie = parseCookies(request.headers.cookie)
  const token = cookie['token'];
  const {id_recept} = request.body;
  
  if(!token) {
    response.status(401).json({message: 'Sesija je istekla'});
    return
  }
  try {
    const query = `delete from Omiljeno where id_korisnik = @id_korisnik and id_recept = @id_recept`
    const decodedUser = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const pool = await sql.connect(mssqlConfig)
    const data: any = (await pool.request()
    .input('id_korisnik', sql.Int, Number(decodedUser.id))
    .input('id_recept', sql.Int, Number(id_recept))
    .query(query)).recordsets
    response.status(200).json({success: true});
    return;
  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default deleteOmiljeno