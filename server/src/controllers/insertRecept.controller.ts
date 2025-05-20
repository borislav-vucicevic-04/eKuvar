import {Request, Response} from 'express'
import sql from 'mssql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config/config';
import mssqlConfig from '../config/mssqlConfig';
import parseCookies from '../utils/parseCookie';
import ISastojak from '../models/sastojak.interface';
import IRecept from '../models/recept.interface';

interface SastojakSaKolicinom extends ISastojak {
  kolicina: string
}
const insertRecept = async (request: Request<{}, {}, {receptData: IRecept, sastojci: SastojakSaKolicinom[]}>, response: Response) => {
  const cookie = parseCookies(request.headers.cookie);
  const token = cookie['token'];
  const receptData = request.body.receptData;
  const sastojci = request.body.sastojci
  
  if(!token) {
    response.status(401).json({message: 'Sesija je istekla'});
    return
  }
  try {
    const queryInserRecept = `
      insert into Recept
      values(@id_korisnik, @datum_kreiranja, @naslov, @porcija, @opis, @priprema, @posno, @vegansko, @slatko);
      select top(1) id from Recept order by datum_kreiranja desc;
    `;
    const queryInsertReceptSastojak = `
      insert into Recept_Sastojak
      values (@id_recept, @id_sastojak, @kolicina);
    `
    const decodedUser = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const pool = await sql.connect(mssqlConfig)
    const insertedReceptID: any =  ((await pool.request()
    .input('id_korisnik', sql.Int, Number(decodedUser.id))
    .input('datum_kreiranja', sql.DateTime2, receptData.datum_kreiranja)
    .input('naslov', sql.NVarChar, receptData.naslov)
    .input('porcija', sql.NVarChar, receptData.porcija)
    .input('opis', sql.NVarChar, receptData.opis)
    .input('priprema', sql.NVarChar, receptData.priprema)
    .input('posno', sql.Bit, Number(receptData.posno))
    .input('vegansko', sql.Bit, Number(receptData.vegansko))
    .input('slatko', sql.Bit, Number(receptData.slatko))
    .query(queryInserRecept)).recordsets as any)[0][0].id
    sastojci.map(async (item) => {
      const result: any = ((await pool.request()
      .input('id_recept', sql.Int, Number(insertedReceptID))
      .input('id_sastojak', sql.Int, item.id)
      .input('kolicina', sql.NVarChar, item.kolicina)
      .query(queryInsertReceptSastojak)).recordsets as any)[0]
      return result
    })
    response.status(200).json({insertedReceptID})
  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default insertRecept