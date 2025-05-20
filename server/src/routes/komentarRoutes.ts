import { Router } from "express";
import insertKomentar from "../controllers/insertKomentar.controller";
import deleteKomentar from "../controllers/deleteKomentar.controller";

const komentarRoutes = Router();

komentarRoutes.post('/insert', insertKomentar);
komentarRoutes.post('/delete', deleteKomentar)

export default komentarRoutes