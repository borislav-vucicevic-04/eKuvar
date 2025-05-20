import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";

// Routes
import logInRoute from "./routes/logInRoute";
import receptRoutes from "./routes/receptRoutes";
import omiljenoRoutes from "./routes/omiljenoRoutes";
import ocjenaRoutes from "./routes/ocjenaRoutes";
import komentarRoutes from "./routes/komentarRoutes";
import korisnikRoutes from "./routes/korisnikRoutes";
import sastojakRoutes from "./routes/sastojakRoutes";
import signUpRoute from "./routes/signupRoute";
import resetPasswordRoutes from "./routes/resetPasswordRoutes";
import deactiveAccountRoute from "./routes/deactivateAccountRoute";
import reactivateAccountRoutes from "./routes/reactivateAccountRoutes";
import userReportRoute from "./routes/userReportRoute";
import logOutRoute from "./routes/logOutRoute";

const app = express();

app.set('trust proxy', 1)

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['Set-Cookie']
}));
app.use(express.json());

// Routes
app.use("/api/korisnik", korisnikRoutes)
app.use("/api/login", logInRoute)
app.use("/api/logout", logOutRoute)
app.use("/api/signup", signUpRoute)
app.use("/api/reset-password", resetPasswordRoutes)
app.use("/api/account/deactivate", deactiveAccountRoute)
app.use("/api/account/reactivate", reactivateAccountRoutes)
app.use("/api/recept", receptRoutes)
app.use("/api/omiljeno", omiljenoRoutes)
app.use("/api/ocjena", ocjenaRoutes)
app.use("/api/komentar", komentarRoutes)
app.use("/api/sastojak", sastojakRoutes)
app.use("/api/userReport", userReportRoute)
export default app