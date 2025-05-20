import { Router } from "express";
import upsertOcjena from "../controllers/upsertOcjena.controller";

const ocjenaRoutes = Router();

ocjenaRoutes.post('/upsert', upsertOcjena);

export default ocjenaRoutes