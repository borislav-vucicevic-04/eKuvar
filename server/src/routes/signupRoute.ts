import { Router, RequestHandler, Request, Response } from "express";
import sql from "mssql";
import mssqlConfig from "../config/mssqlConfig";
import encryption from "../utils/encryption";
import generateToken from "../utils/generateToken";
import hashPassword from "../utils/hashPassword";

// interfaces

interface IResponseBody {
  puno_ime: string,
  email: string,
  datum_registracije: string,
  poslednja_prijava: string
}
interface IRequestBody extends IResponseBody {
  lozinka: string
}
interface IError {
  errorCode: number,
  message: string
}

const signUpRoute = Router();

const createUserAccount = async (request: Request<{}, {}, IRequestBody>, response: Response) => {
  const {puno_ime, email, lozinka, datum_registracije, poslednja_prijava} = request.body;

  try {
    const encEmail = encryption(email).toString();
    const hashed = (await hashPassword(lozinka)).toString();
    const pool = await sql.connect(mssqlConfig)
    const result = await pool.request()
    .input('puno_ime', sql.NVarChar, puno_ime)
    .input('email', sql.NVarChar, encEmail)
    .input('lozinka', sql.NVarChar, hashed)
    .input('datum_registracije', sql.DateTime2, datum_registracije)
    .input('poslednja_prijava', sql.DateTime2, poslednja_prijava)
    .output('id_korisnika', sql.Int)
    .execute('KorisnikSignUp')

    const token = generateToken(result.output.id_korisnika.toString());
    response.cookie('token', token, {
        httpOnly: true,
        secure: false, 
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

    response.status(200).json({
      puno_ime: puno_ime,
      datum_registracije: datum_registracije,
      poslednja_prijava: poslednja_prijava
    } as IResponseBody);
    return;
  } catch (error: any) {
      // Provjera da li je greška iz trigera (RAISERROR)
      if (error instanceof sql.RequestError) {
        console.log(error)
        response.status(400).json();
        return
      }
      console.log(error)
      response.status(500).json({message: 'Interna greška na serveru', error});
      return
  }
}

signUpRoute.post('/', createUserAccount)

export default signUpRoute