import { Router } from "express";
import getAllSastojci from "../controllers/getAllSastojci.controller";
import insertSastojak from "../controllers/insertSastojak.controller";

const sastojakRoutes = Router();

sastojakRoutes.get('/', getAllSastojci);
sastojakRoutes.post('/', insertSastojak)

export default sastojakRoutes