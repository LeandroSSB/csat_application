import nodemailer, { TransportOptions } from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const MAIL_HOST_URL = process.env.MAIL_HOST_URL 
const MAIL_HOST_PORT = process.env.MAIL_HOST_PORT
const MAIL_AUTH_USER = process.env.MAIL_AUTH_USER
const MAIL_AUTH_PASSWORD = process.env.MAIL_AUTH_PASSWORD


export const transporter = nodemailer.createTransport({
  host: MAIL_HOST_URL,
  port: MAIL_HOST_PORT,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: MAIL_AUTH_USER,
    pass: MAIL_AUTH_PASSWORD,
  },
} as TransportOptions );
