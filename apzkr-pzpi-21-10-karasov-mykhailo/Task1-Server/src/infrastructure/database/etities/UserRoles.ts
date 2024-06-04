import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import Role from "./Role";
import User from "./User";


@Table({tableName: 'user_roles', createdAt: false, updatedAt: false})
export default class UserRoles extends Model {

    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id!: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: true})
    userId!: number

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER, allowNull: true})
    roleId!: number
}

