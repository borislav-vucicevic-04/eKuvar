import {Request, Response} from 'express'
import sql from 'mssql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config/config';
import mssqlConfig from '../config/mssqlConfig';
import parseCookies from '../utils/parseCookie';
import IRecept from '../models/recept.interface';

const getAllOmiljeno = async (request: Request, response: Response) => {
  const cookie = parseCookies(request.headers.cookie)
  const token = cookie['token'];
  
  if(!token) {
    response.status(401).json({message: 'Sesija je istekla'});
    return
  }
  try {
    const decodedUser = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const pool = await sql.connect(mssqlConfig)
    const rawData = (await pool.request()
    .input('id_korisnik', sql.Int, Number(decodedUser.id))
    .query<IRecept[]>('select * from Func_Omiljeni_Recepti(@id_korisnik)'))
    .recordsets[0];
    const data: any = rawData.map((item: IRecept) => {
      return {
        id: item.id,
        korisnik: item.korisnik,
        datum_kreiranja: item.datum_kreiranja,
        naslov: item.naslov,
        porcija: item.porcija,
        opis: item.opis,
        priprema: item.priprema,
        prosjecna_ocjena: item.prosjecna_ocjena,
        broj_ocjena: item.broj_ocjena,
        broj_omiljenih: item.broj_omiljenih,
        posno: item.posno,
        vegansko: item.vegansko,
        slatko: item.slatko,
        mojRecept: item.id_korisnik === Number(decodedUser.id)
      }
    });


    response.status(200).json({recepti: data});
    return;
  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default getAllOmiljeno