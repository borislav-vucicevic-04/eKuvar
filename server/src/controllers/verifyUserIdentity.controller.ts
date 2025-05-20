import {Request, Response} from 'express'
import sql from 'mssql'
import mssqlConfig from '../config/mssqlConfig';

interface IReqBody {
  primarni_kod_oporavka: string,
  sekundarni_kod_oporavka: string,
}

const verifyUserIdentity = async (request: Request<{}, {}, IReqBody>, response: Response) => {
  const {primarni_kod_oporavka, sekundarni_kod_oporavka} = request.body;
  try {
    const pool = await sql.connect(mssqlConfig)
    const deactivatedAccount: any = (await pool.request()
    .input('pko', sql.NVarChar, primarni_kod_oporavka)
    .input('sko', sql.NVarChar, sekundarni_kod_oporavka)
    .query('select * from Ugaseni_nalozi where primarni_kod_oporavka=@pko and sekundarni_kod_oporavka=@sko')).recordset[0];

    if(!deactivatedAccount){
      response.status(404).json({message: `Niste unijeli ispravne kodove za oporavak naloga...`});
      return
    }

    response.status(200).json({status: 'succes'});
    return

  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default verifyUserIdentity