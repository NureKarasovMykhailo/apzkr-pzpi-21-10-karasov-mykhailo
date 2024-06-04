import { db_host, db_port, db_name, db_user, db_password} from '../../config';
import { Sequelize } from 'sequelize-typescript';
import UserRoles from "./etities/UserRoles";
import User from "./etities/User";
import Role from "./etities/Role";
import Activity from "./etities/Activity";
import Company from "./etities/Company";
import Complexity from "./etities/Complexity";
import Education from "./etities/Education";
import Scanner from "./etities/Scanner";
import ScannerHistory from "./etities/ScannerHistory";
import Subscription from "./etities/Subscription";
import UserActivities from "./etities/UserActivities";
import UserEducations from "./etities/UserEducations";


const sequelize = new Sequelize({
    dialect: 'postgres',
    host: db_host,
    username: db_user,
    password: db_password,
    database: db_name,
    port: db_port,
    logging: false,
    models: [
        Role,
        User,
        UserRoles,
        Activity,
        Company,
        Complexity,
        Education,
        Scanner,
        ScannerHistory,
        Subscription,
        UserActivities,
        UserEducations,
    ]
    
});


export default sequelize;