import { Router } from "express";
import getKorisnik from "../controllers/getKorisnik.controller";

const korisnikRoutes = Router();

korisnikRoutes.get('/getOne', getKorisnik)

export default korisnikRoutes