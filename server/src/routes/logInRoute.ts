import { Router, RequestHandler } from "express";
import sql from "mssql";
import mssqlConfig from "../config/mssqlConfig";
import bcrypt from 'bcrypt';
import encryption from "../utils/encryption";
import generateToken from "../utils/generateToken";

// interfaces
import IKorisnik from "../models/korisnik.interfact";

const logInRoute = Router();

interface IResponse {
  puno_ime: string,
  email: string,
  datum_registracije: string,
  poslednja_prijava: string
}
interface IError {
  errorCode: number,
  message: string
}

const authentificateUser: RequestHandler = async (request, response) => {
  try {
    const {email, lozinka} = request.body;
    const pool = sql.connect(mssqlConfig);
    const encEmail = encryption(email);
      
    const result = (await pool).request()
    .input('Email', sql.NVarChar, encEmail)
    .execute<IKorisnik>('KorisnikLogIn');

      const user = (await result).recordset[0]
  
      if (!user || !user.lozinka) {   
        const resObj: IError = {
          errorCode: 401,
          message: 'Email i/ili lozinka su neispravni'
        }     
        response.status(401).json(resObj);
        return;
      }

      const isMatch = await bcrypt.compare(lozinka, user.lozinka)

      if(!isMatch) {
        const resObj: IError = {
          errorCode: 401,
          message: 'Email i/ili lozinka su neispravni'
        }     
        response.status(401).json(resObj);
        return;
      }
      // Autentifikacija uspješna
      const token = generateToken(user.id!.toString());
      response.cookie('token', token, {
          httpOnly: true,
          secure: false, 
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000
        })

      response.status(200).json({
        puno_ime: user.puno_ime!,
        datum_registracije: user.datum_registracije!,
        poslednja_prijava: user.poslednja_prijava!
      } as IResponse);
      return;
  } catch (error) {
    console.error('Greška pri logovanju:', error);
    response.status(500).json({ message: 'Greška na serveru.', error });
    return ;
  }
}

logInRoute.post('/', authentificateUser);

export default logInRoute;