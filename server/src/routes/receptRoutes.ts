import { Router } from "express";
import getAllRecept from "../controllers/getAllRecept.controller";
import getRecept from "../controllers/getRecept.controller";
import insertRecept from "../controllers/insertRecept.controller";
import updateRecept from "../controllers/updateRecept.controller";
import deleteRecept from "../controllers/deleteRecept.cotroller";
import getAllOmiljeno from "../controllers/getAllOmiljeno.controller";
import generateReceptReport from "../controllers/generateReceptReport.controller";

const receptRoutes = Router();

receptRoutes.post('/', getAllRecept);
receptRoutes.get('/:id', getRecept);
receptRoutes.post('/new', insertRecept);
receptRoutes.post('/edit/:id', updateRecept);
receptRoutes.post('/delete', deleteRecept);
receptRoutes.get('/kategorija/omiljeno', getAllOmiljeno);
receptRoutes.post('/generateReport', generateReceptReport)

export default receptRoutes