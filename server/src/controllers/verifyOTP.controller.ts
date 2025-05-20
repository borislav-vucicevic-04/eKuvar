import {Request, Response} from 'express'
import sql from 'mssql'
import mssqlConfig from '../config/mssqlConfig';
import encryption from '../utils/encryption';

const verifyOTP = async (request: Request<{}, {}, {email: string, otp: string}>, response: Response) => {
  const {email, otp} = request.body;
  const encEmail = encryption(email);
  try {
    const pool = await sql.connect(mssqlConfig);
    const result: any = !!((await pool.request()
    .input('email', sql.NVarChar, encEmail)
    .input('otp', sql.NVarChar, otp)
    .query('select * from Korisnik where email=@email and otp=@otp')).recordsets as any)[0][0]
    
    if(!result) {
      response.status(404).json({message: 'Neispravan kod'});
      return;
    } else {
      response.status(200).json({message: 'Kod je ispravan'})
    }

  } catch (error) {
    console.log(error)
    response.status(500).json({message: 'Interna greška na serveru', error});
    return
  }
}

export default verifyOTP