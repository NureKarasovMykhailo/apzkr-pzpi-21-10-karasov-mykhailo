import * as uuid from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import ApiError from "../error/ApiError";
import i18n from "i18n";

class FileManager {
    async createFile(file: any): Promise<string> {
        try {
            const fileName = uuid.v4() + '.jpg';
            const filePath = path.resolve(__dirname, '..', '..', '..', '..', '.dist', 'static');
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }
            console.log(file)
            fs.writeFileSync(path.join(filePath, fileName), file.data);
            return fileName;
        } catch (error) {
            console.log(error);
            throw ApiError.internalServerError(i18n.__('creatingFileError'));
        }
    }

    async deleteFile(fileName: string) {
        try {
            const filePath = path.resolve(__dirname, '..', '..', '..', '..', '.dist', 'static');
            if (fs.existsSync(filePath)) {
                fs.unlink(path.join(filePath, fileName), () => {
                    console.log(`${fileName} was deleted`);
                });
                return true;
            }
        } catch (error) {
            console.log(error);
            throw ApiError.internalServerError(i18n.__('creatingFileError'));
        }
    }
}

export default FileManager;