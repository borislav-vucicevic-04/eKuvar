"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("./config"));
dotenv_1.default.config();
const mssqlConfig = {
    user: config_1.default.DB_USER,
    password: config_1.default.DB_PASSWORD,
    server: config_1.default.DB_SERVER,
    database: config_1.default.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
    },
    port: Number(config_1.default.DB_SERVER_PORT)
};
exports.default = mssqlConfig;
