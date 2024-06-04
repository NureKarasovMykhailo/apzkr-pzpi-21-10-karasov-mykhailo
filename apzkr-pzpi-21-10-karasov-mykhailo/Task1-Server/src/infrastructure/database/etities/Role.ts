import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import UserRoles from "./UserRoles";
import User from "./User";


@Table({tableName: 'roles'})
export default class Role extends Model {

    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id!: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    roleTitle!: string;

    @Column({type: DataType.STRING, allowNull: true})
    description!: string | null;

    @BelongsToMany(() => User, () => UserRoles)
    users!: User[]
}