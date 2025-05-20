import {Request, Response} from 'express'
import sql from 'mssql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config/config';
import mssqlConfig from '../config/mssqlConfig';
import parseCookies from '../utils/parseCookie';

interface ReqBody {
  id_recept: number,
  odgovor_na: number | null,
  datum_objave: string,
  sadrzaj: string
}

const insertKomentar = async (request: Request<{}, {}, ReqBody>, response: Response) => {
  const cookie = parseCookies(request.headers.cookie);
  const token = cookie['token'];
  const {id_recept, odgovor_na, datum_objave, sadrzaj} = request.body;
  console.log(request.body);
  
  if(!token) {
    response.status(401).json({message: 'Sesija je istekla'});
    return
  }
  try {
    const query = `
      insert into Komentar
      output INSERTED.id
      values (@id_korisnik, @id_recept, @odgovor_na, @datum_objave, @sadrzaj);
    `;
    const decodedUser = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const pool = await sql.connect(mssqlConfig)
    const insertedID: any = ((await pool.request()
    .input('id_korisnik', sql.Int, Number(decodedUser.id))
    .input('id_recept', sql.Int, Number(id_recept))
    .input('odgovor_na', sql.Int, odgovor_na)
    .input('datum_objave', sql.DateTime2, datum_objave)
    .input('sadrzaj', sql.NVarChar, sadrzaj)
    .query(query)).recordset as any)[0].id ;

    response.status(200).json({insertedID})
  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default insertKomentar