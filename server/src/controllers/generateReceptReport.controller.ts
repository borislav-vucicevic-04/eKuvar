import {Request, Response} from 'express'
import sql from 'mssql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config/config';
import mssqlConfig from '../config/mssqlConfig';
import parseCookies from '../utils/parseCookie';

const generateReceptReport = async (request: Request<{}, {}, {id: number}>, response: Response) => {
  const cookie = parseCookies(request.headers.cookie)
  const token = cookie['token'];
  const {id} = request.body;
  
  if(!token) {
    response.status(401).json({message: 'Sesija je istekla'});
    return
  }
  try {
    const pool = await sql.connect(mssqlConfig)
    const data = (await pool.request()
    .input('id_recept', sql.Int, Number(id))
    .query(`
      select * from Func_Izvjestaj_Recepta(@id_recept);
      select * from Func_Recept_Sve_Ocjene(@id_recept);
      select * from Func_Recept_Svi_Omiljeni(@id_recept);  
    `))
    .recordsets as any;

    const osnovni_podaci: any = data[0][0];
    const ocjene: any = data[1];
    const omiljeni: any = data[2];
    
    response.status(200).json({osnovni_podaci, ocjene, omiljeni})

    return;
  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default generateReceptReport