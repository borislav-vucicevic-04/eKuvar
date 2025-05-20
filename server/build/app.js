"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Routes
const logInRoute_1 = __importDefault(require("./routes/logInRoute"));
const receptRoutes_1 = __importDefault(require("./routes/receptRoutes"));
const omiljenoRoutes_1 = __importDefault(require("./routes/omiljenoRoutes"));
const ocjenaRoutes_1 = __importDefault(require("./routes/ocjenaRoutes"));
const komentarRoutes_1 = __importDefault(require("./routes/komentarRoutes"));
const korisnikRoutes_1 = __importDefault(require("./routes/korisnikRoutes"));
const sastojakRoutes_1 = __importDefault(require("./routes/sastojakRoutes"));
const signupRoute_1 = __importDefault(require("./routes/signupRoute"));
const resetPasswordRoutes_1 = __importDefault(require("./routes/resetPasswordRoutes"));
const deactivateAccountRoute_1 = __importDefault(require("./routes/deactivateAccountRoute"));
const reactivateAccountRoutes_1 = __importDefault(require("./routes/reactivateAccountRoutes"));
const userReportRoute_1 = __importDefault(require("./routes/userReportRoute"));
const logOutRoute_1 = __importDefault(require("./routes/logOutRoute"));
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['Set-Cookie']
}));
app.use(express_1.default.json());
// Routes
app.use("/api/korisnik", korisnikRoutes_1.default);
app.use("/api/login", logInRoute_1.default);
app.use("/api/logout", logOutRoute_1.default);
app.use("/api/signup", signupRoute_1.default);
app.use("/api/reset-password", resetPasswordRoutes_1.default);
app.use("/api/account/deactivate", deactivateAccountRoute_1.default);
app.use("/api/account/reactivate", reactivateAccountRoutes_1.default);
app.use("/api/recept", receptRoutes_1.default);
app.use("/api/omiljeno", omiljenoRoutes_1.default);
app.use("/api/ocjena", ocjenaRoutes_1.default);
app.use("/api/komentar", komentarRoutes_1.default);
app.use("/api/sastojak", sastojakRoutes_1.default);
app.use("/api/userReport", userReportRoute_1.default);
exports.default = app;
