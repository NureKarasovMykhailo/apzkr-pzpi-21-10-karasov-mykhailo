import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import User from "./User";
import Activity from "./Activity";

@Table({tableName: 'user_activities', createdAt: false, updatedAt: false})
export default class UserActivities extends Model {

    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id!: number;

    @Column({type: DataType.INTEGER})
    rang!: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: true})
    userId!: number | null;

    @ForeignKey(() => Activity)
    @Column({type: DataType.INTEGER, allowNull: true})
    activityId!: number | null;


}