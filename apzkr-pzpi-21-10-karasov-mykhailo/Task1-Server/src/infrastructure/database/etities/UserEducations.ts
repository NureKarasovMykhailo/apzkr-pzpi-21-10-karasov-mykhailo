import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import User from "./User";
import Education from "./Education";


@Table({tableName: 'user_educations', createdAt: false, updatedAt: false})
export default class UserEducations extends Model {

    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id!: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: true})
    userId!: number

    @ForeignKey(() => Education)
    @Column({type: DataType.INTEGER, allowNull: true})
    educationId!: number
}

