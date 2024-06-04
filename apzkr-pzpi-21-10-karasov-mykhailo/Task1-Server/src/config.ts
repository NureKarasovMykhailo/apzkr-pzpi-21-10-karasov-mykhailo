import dotenv from 'dotenv';
import * as process from "process";

dotenv.config();

export const port = Number(process.env.PORT || 6000);
export const db_host = String(process.env.DB_HOST);
export const db_port = Number(process.env.DB_PORT);
export const db_name = String(process.env.DB_NAME);
export const db_user = String(process.env.DB_USER);
export const db_password = String(process.env.DB_PASSWORD);

export const JWT_SECRET_KEY = String(process.env.JWT_SECRET_KEY)

export const DEFAULT_COMPANY_IMAGE_NAME = 'default-company-image.jpg';
export const DEFAULT_USER_IMAGE_NAME = 'default-user-image.jpg';