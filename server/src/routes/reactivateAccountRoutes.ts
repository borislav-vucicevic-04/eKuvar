import { Router } from "express";
import verifyUserIdentity from "../controllers/verifyUserIdentity.controller";
import setUserDetails from "../controllers/setUserDetails.controller";

const reactivateAccountRoutes = Router();

reactivateAccountRoutes.post('/verify-user-identity', verifyUserIdentity);
reactivateAccountRoutes.post('/set-user-details', setUserDetails);

export default reactivateAccountRoutes