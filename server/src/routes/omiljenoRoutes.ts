import { Router } from "express";
import insertOmiljeno from "../controllers/insertOmiljeno.controller";
import deleteOmiljeno from "../controllers/deleteOmiljeno.controller";

const omiljenoRoutes = Router();

omiljenoRoutes.post('/insert', insertOmiljeno);
omiljenoRoutes.post('/delete', deleteOmiljeno)

export default omiljenoRoutes