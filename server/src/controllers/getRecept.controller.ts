import {Request, Response} from 'express'
import sql from 'mssql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config/config';
import mssqlConfig from '../config/mssqlConfig';
import parseCookies from '../utils/parseCookie';
import IRecept from '../models/recept.interface';
import IReceptSastojak from '../models/receptSastojak.interface';
import IKomentar from '../models/komentar.interface';

const getRecept = async (request: Request<{id: string}>, response: Response) => {
  const id = request.params.id;
  const cookie = parseCookies(request.headers.cookie)
  const token = cookie['token'];
  
  if(!token) {
    response.status(401).json({message: 'Sesija je istekla'});
    return
  }
  try {
    const queries = `
      select * from vw_Recept_Svi_Podaci where id = @id;
      select * from vw_Recept_Sastojak_Svi_Podaci where id_recept=@id;
      select vrijednost as ocjena from Ocjena where id_recept=@id and id_korisnik=@id_korisnik;
      select IIF(EXISTS(select * from Omiljeno where id_recept=@id and id_korisnik=@id_korisnik), 1, 0) as omiljen;
      select * from vw_Komentar_Svi_Podaci where id_recept=@id order by datum_objave desc;
    `
    const decodedUser = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const pool = await sql.connect(mssqlConfig);
    const recordsets: any = (await pool.request()
      .input('id', sql.Int, Number(id))
      .input('id_korisnik', sql.Int, Number(decodedUser.id))
      .query(queries)).recordsets;

    if(recordsets[0].length === 0) {
      response.status(404).json({message: 'Recept nije pronađen'});
      return;
    }
    const recept = recordsets[0][0] as IRecept;
    const sastojci = recordsets[1] as IReceptSastojak[];
    const ocjena = !!recordsets[2][0] ? recordsets[2][0].ocjena : null;
    const omiljen = !!recordsets[3][0].omiljen;
    const rawComments = recordsets[4] as IKomentar[];
    const komentari = rawComments.map(item => {
      return {
        id: item.id,
        autor: item.puno_ime,
        id_recept: item.id_recept,
        odgovor_na: item.odgovor_na,
        datum_objave: item.datum_objave,
        sadrzaj: item.sadrzaj,
        mojKomentar: item.id_korisnik === Number(decodedUser.id)
      }
    })

    response.status(200).json({recept: {
      id: recept.id,
      korisnik: recept.korisnik,
      datum_kreiranja: recept.datum_kreiranja,
      naslov: recept.naslov,
      porcija: recept.porcija,
      opis: recept.opis,
      priprema: recept.priprema,
      prosjecna_ocjena: recept.prosjecna_ocjena,
      broj_ocjena: recept.broj_ocjena,
      broj_omiljenih: recept.broj_omiljenih,
      posno: recept.posno,
      vegansko: recept.vegansko,
      slatko: recept.slatko,
      mojRecept: recept.id_korisnik === Number(decodedUser.id),
    }, sastojci, ocjena: ocjena, omiljen, komentari, recordsets});


  }
  catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}
export default getRecept