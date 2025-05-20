import {Request, Response} from 'express'
import sql, { NVarChar } from 'mssql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config/config';
import mssqlConfig from '../config/mssqlConfig';
import parseCookies from '../utils/parseCookie';

const getAllSastojci = async (request: Request<{}, {}, {}, {search: string}>, response: Response) => {
  const cookie = parseCookies(request.headers.cookie);
  const token = cookie['token'];
  const search = request.query.search;
  
  if(!token) {
    response.status(401).json({message: 'Sesija je istekla'});
    return
  }
  try {
    const query = `
      select * from Sastojak where naziv like CONCAT('%', @searchParam, '%');
    `;
    const decodedUser = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const pool = await sql.connect(mssqlConfig);
    const result: any = ((await pool.request().input('searchParam', sql.NVarChar, search).query(query)).recordsets as any)[0]
    response.status(200).json(result)
  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default getAllSastojci