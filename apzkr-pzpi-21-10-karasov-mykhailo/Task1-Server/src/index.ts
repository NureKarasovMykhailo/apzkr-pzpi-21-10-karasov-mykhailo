import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { port } from './config';
import sequelize from './infrastructure/database/database';
import router from './infrastructure/routes/index';
import errorHandler from "./core/common/middlewares/ErrorHandlingMiddleware";
import fileUpload from 'express-fileupload'
import i18n from "i18n";
import path from "path";
import localizationMiddleware from "./core/common/middlewares/LocalizationMiddleware";

dotenv.config();

const app = express();

const PORT = port;

i18n.configure({
    locales: ['en', 'uk'],
    directory: path.join(__dirname, 'locales'),
    defaultLocale: 'uk',
    objectNotation: true,
    register: global
});


app.use(cors());
app.use(i18n.init);
app.use(localizationMiddleware);
app.use(fileUpload());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '..', '.dist', 'static')));
app.use('/api', router);


// LAST MIDDLEWARE
app.use(errorHandler);

try {
    sequelize.sync().then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`[server]: Server started work on http://localhost:${PORT}`);
        })
    })
} catch (error) {
    console.log(error);
}