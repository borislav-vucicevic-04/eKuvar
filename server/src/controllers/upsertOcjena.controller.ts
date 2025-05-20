import {Request, Response} from 'express'
import sql from 'mssql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config/config';
import mssqlConfig from '../config/mssqlConfig';
import parseCookies from '../utils/parseCookie';



const upsertOcjena = async (request: Request<{}, {}, {id_recept: string, nova_ocjena: number}>, response: Response) => {
  const cookie = parseCookies(request.headers.cookie)
  const token = cookie['token'];
  const {id_recept, nova_ocjena} = request.body;
  
  if(!token) {
    response.status(401).json({message: 'Sesija je istekla'});
    return
  }
  try {
    const decodedUser = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const pool = await sql.connect(mssqlConfig)
    const result = await pool.request()
    .input('id_korisnik', sql.Int, Number(decodedUser.id))
    .input('id_recept', sql.Int, id_recept)
    .input('vrijednost', sql.Int, nova_ocjena)
    .output('prosjecna_ocjena', sql.Float)
    .output('broj_ocjena', sql.Int)
    .execute('Proc_Ocjena_Upsert');
    response.status(200).json({
      nova_prosjecna_ocjena: result.output.prosjecna_ocjena,
      novi_broj_ocjena: result.output.broj_ocjena
    })
    return;
  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default upsertOcjena