import {Request, Response} from 'express'
import sql from 'mssql'
import mssqlConfig from '../config/mssqlConfig';
import encryption from '../utils/encryption';
import hashPassword from '../utils/hashPassword';

interface IReqBody {
  primarni_kod_oporavka: string,
  sekundarni_kod_oporavka: string,
  email: string,
  puno_ime: string,
  lozinka: string,
}

const setUserDetails = async (request: Request<{}, {}, IReqBody>, response: Response) => {
  const {primarni_kod_oporavka, sekundarni_kod_oporavka, email, puno_ime, lozinka} = request.body;
  try {
    const pool = await sql.connect(mssqlConfig)
    const deactivatedAccount: any = (await pool.request()
    .input('pko', sql.NVarChar, primarni_kod_oporavka)
    .input('sko', sql.NVarChar, sekundarni_kod_oporavka)
    .query('select * from Ugaseni_nalozi where primarni_kod_oporavka=@pko and sekundarni_kod_oporavka=@sko')).recordset[0];
    
    console.log(deactivatedAccount)
    const result = await pool.request()
    .input('id', sql.Int, deactivatedAccount.id_korisnik)
    .input('email', sql.NVarChar, encryption(email))
    .input('lozinka', sql.NVarChar, (await hashPassword(lozinka)).toString())
    .input('puno_ime', sql.NVarChar, puno_ime.toLowerCase())
    .execute('OporaviNalog');
    
    response.status(200).json(result);
    return

  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default setUserDetails