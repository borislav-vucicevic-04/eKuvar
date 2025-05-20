import {Request, Response} from 'express'
import sql from 'mssql'
import mssqlConfig from '../config/mssqlConfig';
import encryption from '../utils/encryption';
import hashPassword from '../utils/hashPassword';

const setNewPassword = async (request: Request<{}, {}, {email: string, otp: string, lozinka: string}>, response: Response) => {
  const {email, otp, lozinka} = request.body;
  const encEmail = encryption(email);
  const hasedLozinka = (await hashPassword(lozinka)).toString();
  try {
    const pool = await sql.connect(mssqlConfig);
    const result = (await pool.request()
    .input('email', sql.NVarChar, encEmail)
    .input('otp', sql.NVarChar, otp)
    .input('lozinka', sql.NVarChar, hasedLozinka)
    .query(`
      update Korisnik
      set lozinka=@lozinka, otp=NULL
      where email=@email and otp=@otp  
    `)).rowsAffected

    response.status(200).json(result)

  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default setNewPassword