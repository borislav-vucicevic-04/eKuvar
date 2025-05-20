import dotenv from 'dotenv'
import config from './config'
import {config as SqlConfig} from 'mssql'

dotenv.config()

const mssqlConfig: SqlConfig = {
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  server: config.DB_SERVER,
  database: config.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    trustedConnection: false,
    enableArithAbort: true,
  },
  port: Number(config.DB_SERVER_PORT)
}

export default mssqlConfig