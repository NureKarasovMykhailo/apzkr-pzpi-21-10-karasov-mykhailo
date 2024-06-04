import {
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    HasOne,
    Model,
    Table
} from "sequelize-typescript";
import {DEFAULT_USER_IMAGE_NAME} from "../../../config";
import UserRoles from "./UserRoles";
import Role from "./Role";
import Education from "./Education";
import UserEducations from "./UserEducations";
import Company from "./Company";
import ScannerHistory from "./ScannerHistory";
import Activity from "./Activity";
import UserActivities from "./UserActivities";
import Subscription from "./Subscription";
import Scanner from "./Scanner";


@Table({tableName: 'users'})
export default class User extends Model {

    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id!: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email!: string;

    @Column({type: DataType.STRING, allowNull: false})
    firstName!: string;

    @Column({type: DataType.STRING, allowNull: false})
    secondName!: string;

    @Column({type: DataType.STRING, allowNull: false})
    password!: string;

    @Column({type: DataType.STRING, allowNull: true})
    phoneNumber!: string | null;

    @Column({type: DataType.DATEONLY, allowNull: false})
    birthday!: Date;

    @Column({type: DataType.STRING, allowNull: false, defaultValue: DEFAULT_USER_IMAGE_NAME})
    userImage!: string;

    @ForeignKey(() => Company)
    @Column({type: DataType.INTEGER, allowNull: true})
    companyId!: number | null;

    @BelongsToMany(() => Role, () => UserRoles)
    roles!: Role[]

    @BelongsToMany(() => Education, () => UserEducations)
    educations!: Education[]

    @HasOne(() => Company)
    company!: Company;

    @HasMany(() => ScannerHistory)
    scannerHistory!: ScannerHistory[];

    @HasOne(() => Scanner)
    scanner!: Scanner;

    @BelongsToMany(() => Activity, () => UserActivities)
    activities!: Activity[];

    @HasOne(() => Subscription)
    subscription!: Subscription;
}