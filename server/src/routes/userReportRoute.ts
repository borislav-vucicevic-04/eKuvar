import { Router } from "express";
import insertKomentar from "../controllers/insertKomentar.controller";
import generateUserReport from "../controllers/generateUserReport.controller";

const userReportRoute = Router();

userReportRoute.get('/', generateUserReport);

export default userReportRoute