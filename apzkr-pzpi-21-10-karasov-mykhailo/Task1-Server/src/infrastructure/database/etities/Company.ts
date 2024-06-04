import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import User from "./User";
import {DEFAULT_COMPANY_IMAGE_NAME} from "../../../config";
import Scanner from "./Scanner";
import Activity from "./Activity";

@Table({tableName: 'company'})
export default class Company extends Model {

    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id!: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    companyName!: string;

    @Column({type: DataType.STRING, allowNull: true})
    description!: string | null;

    @Column({type: DataType.STRING, allowNull: false, defaultValue: DEFAULT_COMPANY_IMAGE_NAME})
    companyImage!: string;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: true})
    userId!: number

    @BelongsTo(() => User)
    owner!: User;

    @HasMany(() => User)
    user!: User[];

    @HasMany(() => Scanner)
    scanners!: Scanner[];

    @HasMany(() => Activity)
    activities!: Activity[];
}