import {Request, Response} from 'express'
import sql from 'mssql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config/config';
import mssqlConfig from '../config/mssqlConfig';
import parseCookies from '../utils/parseCookie';

const deleteRecept = async (request: Request<{}, {}, {id_recept: string}>, response: Response) => {
  const cookie = parseCookies(request.headers.cookie);
  const token = cookie['token'];
  const id_recept = request.body.id_recept
  
  if(!token) {
    response.status(401).json({message: 'Sesija je istekla'});
    return
  }
  try {
    const queryDeleteRecept = 'delete from Recept where id=@id_recept'
    const decodedUser = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const pool = await sql.connect(mssqlConfig);

    await pool.request().input('id_recept', sql.Int, id_recept).query(queryDeleteRecept)

    response.status(200).json({success: true}) 
  } catch (error: any) {
    // Provjera da li je greška iz trigera (RAISERROR)
    if (error instanceof sql.RequestError) {
      console.log(error)
      response.status(400).json();
      return
    }
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default deleteRecept