import {Request, NextFunction, Response} from "express";
import ExportImportManager from "../database/exportImportManager";
import * as path from "path";
import fs from "fs";
import ApiError from "../../core/common/error/ApiError";
import i18n from "i18n";

export default class DbController {

    public async exportDb(req: Request, res: Response, next: NextFunction) {
        try {
            const exportImportDb = new ExportImportManager();
            const fileName = await exportImportDb.exportData();
            if (fileName === undefined) {
                return next(ApiError.internalServerError(i18n.__('unknownError')));
            }
            const filePath = path.join(__dirname, '..', 'database',  'dbCopy', fileName);

            res.download(filePath, fileName, (err) => {
                if (err) {
                    return res.status(500).send(i18n.__('sendingFileError'));
                }

                fs.unlinkSync(filePath);
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async importDb(req: Request, res: Response, next: NextFunction) {
        try {
            // @ts-ignore
            const file = req.files.db;

            if (!file) {
                return next(ApiError.badRequest(i18n.__('thereNoFile')));
            }


            const filePath = path.resolve(__dirname, '..', 'database', 'dbCopy');
            // @ts-ignore
            fs.writeFileSync(path.join(filePath, file.name), file.data, {flag: 'w'});
            const exportImportDb = new ExportImportManager();
            // @ts-ignore
            await exportImportDb.importData(path.resolve(filePath, file.name));
            res.status(200).json({ message: i18n.__('fileUploaded') });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }


}