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
const updateRecept = async (request: Request<{}, {}, {receptData: IRecept, sastojci: SastojakSaKolicinom[]}>, response: Response) => {
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
      update Recept
      set naslov=@naslov, porcija=@porcija, opis=@opis, priprema=@priprema, posno=@posno, vegansko=@vegansko, slatko=@slatko
      where id=@id_recept;
    `;
    const queryDeleteReceptSastojak = `
      delete from Recept_Sastojak
      where id_recept=@id_recept;
    `
    const queryUpdateReceptSastojak = `
      insert into Recept_Sastojak
      values (@id_recept, @id_sastojak, @kolicina);
    `
    const decodedUser = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const pool = await sql.connect(mssqlConfig)

    // editovanje podataka o receptu
    await pool.request()
    .input('id_recept', sql.Int, receptData.id)
    .input('naslov', sql.NVarChar, receptData.naslov)
    .input('porcija', sql.Int, receptData.porcija)
    .input('opis', sql.NVarChar, receptData.opis)
    .input('priprema', sql.NVarChar, receptData.priprema)
    .input('posno', sql.Bit, Number(receptData.posno))
    .input('vegansko', sql.Bit, Number(receptData.vegansko))
    .input('slatko', sql.Bit, Number(receptData.slatko))
    .query(queryInserRecept)
    
    // brisanje sastojaka iz tabele Recept_Sastojak
    await pool.request().input('id_recept', sql.Int, receptData.id).query(queryDeleteReceptSastojak);

    // dodavanje sastojaka
    sastojci.map(async (item) => {
      const result: any = ((await pool.request()
      .input('id_recept', sql.Int, receptData.id)
      .input('id_sastojak', sql.Int, item.id)
      .input('kolicina', sql.NVarChar, item.kolicina)
      .query(queryUpdateReceptSastojak)).recordsets as any)[0]
      return result
    })
    response.status(200).json({updatedID: receptData.id}) 
  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default updateRecept