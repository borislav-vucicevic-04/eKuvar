import {Request, Response} from 'express'
import sql from 'mssql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config/config';
import mssqlConfig from '../config/mssqlConfig';
import parseCookies from '../utils/parseCookie';
import IRecept from '../models/recept.interface';
import IFilter from '../models/filter.interface';

const POREDAJ_PO_KOLONAMA = [
  'naslov',
  'korisnik',
  'datum_kreiranja',
  'porcija',
  'prosjecna_ocjena'
];

const POREDAK = ['asc', 'desc']

const getAllRecept = async (request: Request<{}, {}, IFilter>, response: Response) => {
  const cookie = parseCookies(request.headers.cookie)
  const token = cookie['token'];
  const filter = request.body;
  
  if(!token) {
    response.status(401).json({message: 'Sesija je istekla'});
    return
  }
  try {
    
    const sortirajPo = POREDAJ_PO_KOLONAMA.includes(filter.sortirajPo) ? filter.sortirajPo : 'prosjecna_ocjena';
    const poredak = POREDAK.includes(filter.poredak) ? filter.poredak : 'desc'
    const decodedUser = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const pool = await sql.connect(mssqlConfig)
    const rawData = (await pool.request()
    .input('naslov', sql.NVarChar, filter.naslov ?? null)
    .input('autor', sql.NVarChar, filter.korisnik)
    .input('datum_kreiranja_min', sql.DateTime2, filter.datum_kreiranja_min)
    .input('datum_kreiranja_max', sql.DateTime2, filter.datum_kreiranja_max)
    .input('porcija_min', sql.TinyInt, filter.porcija_min)
    .input('porcija_max', sql.TinyInt, filter.porcija_max)
    .input('prosjecna_ocjena_min', sql.Decimal(4, 2), filter.prosjecna_ocjena_min)
    .input('prosjecna_ocjena_max', sql.Decimal(4, 2), filter.prosjecna_ocjena_max)
    .input('posno', sql.Bit, filter.posno === null ?  null : Number(filter.posno))
    .input('vegansko', sql.Bit, filter.vegansko === null ?  null : Number(filter.vegansko))
    .input('slatko', sql.Bit, filter.slatko === null ?  null : Number(filter.slatko))
    .query<IRecept[]>(`
      SELECT * FROM Func_Filtriraj_Recepte(
        @naslov, @autor, @datum_kreiranja_min, @datum_kreiranja_max, @porcija_min, @porcija_max, 
        @prosjecna_ocjena_min, @prosjecna_ocjena_max, @posno, @vegansko, @slatko) 
        order by ${sortirajPo} ${poredak}`))
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

export default getAllRecept