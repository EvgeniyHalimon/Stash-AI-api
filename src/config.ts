// library
import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  HOST:
    process.env.NODE_ENV === 'production'
      ? process.env.HOST
      : process.env.HOST_DEV,
  DB_PORT:
    process.env.NODE_ENV === 'production'
      ? Number(process.env.DB_PORT)
      : Number(process.env.DB_PORT_DEV),
  SERVER_PORT: process.env.SERVER_PORT ?? 3001,
  DB_USERNAME:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_USERNAME
      : process.env.DB_USERNAME_DEV,
  PASSWORD:
    process.env.NODE_ENV === 'production'
      ? process.env.PASSWORD
      : process.env.PASSWORD_DEV,
  DATABASE:
    process.env.NODE_ENV === 'production'
      ? process.env.DATABASE
      : process.env.DATABASE_DEV,
  SECRET_ACCESS: process.env.SECRET_ACCESS,
  SECRET_REFRESH: process.env.SECRET_REFRESH,
  SECRET_CONFIRM: process.env.SECRET_CONFIRM,
  EXPIRES_IN: process.env.EXPIRES_IN ?? '',
  EXPIRES_IN_REFRESH: process.env.EXPIRES_IN_REFRESH ?? '',
  EXPIRES_IN_CONFIRM: process.env.EXPIRES_IN_CONFIRM ?? '',
  FE_URL:
    process.env.NODE_ENV === 'production'
      ? String(process.env.FE_URL)
      : 'http://localhost:3000',
};
