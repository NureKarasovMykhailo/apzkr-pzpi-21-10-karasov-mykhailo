import User from "./etities/User";
import Role from "./etities/Role";
import UserRoles from "./etities/UserRoles";
import Activity from "./etities/Activity";
import Company from "./etities/Company";
import Complexity from "./etities/Complexity";
import Education from "./etities/Education";
import Scanner from "./etities/Scanner";
import ScannerHistory from "./etities/ScannerHistory";
import Subscription from "./etities/Subscription";
import UserActivities from "./etities/UserActivities";
import UserEducations from "./etities/UserEducations";
import {Model, Sequelize} from "sequelize-typescript";
import fs from 'fs';
import sequelize from "./database";
import * as path from "path";
export default class ExportImportManager {

    public async exportData() {
        try {
            let allData: {[key: string]: any} = {};

            const models: Model<any, any>[] = [
                // @ts-ignore
                Role,
                // @ts-ignore
                User,
                // @ts-ignore
                UserRoles,
                // @ts-ignore
                Company,
                // @ts-ignore
                Complexity,
                // @ts-ignore
                Education,
                // @ts-ignore
                Activity,
                // @ts-ignore
                Scanner,
                // @ts-ignore
                ScannerHistory,
                // @ts-ignore
                Subscription,
                // @ts-ignore
                UserActivities,
                // @ts-ignore
                UserEducations
            ];


            for (const model of models) {
                // @ts-ignore
                const modelName = model.getTableName();
                // @ts-ignore
                allData[modelName] = await model.findAll();
            }

            const allDataJSON = JSON.stringify(allData, null, 1);

            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().replace(/:/g, '-').replace('T', '_');
            const fileName = `data_${formattedDate}.json`;

            const filePath = path.join(__dirname, 'dbCopy', fileName);

            fs.writeFileSync(filePath, allDataJSON, { flag: 'w' });
            return fileName;
        } catch (error) {
            console.log(error);
        }
    }



}