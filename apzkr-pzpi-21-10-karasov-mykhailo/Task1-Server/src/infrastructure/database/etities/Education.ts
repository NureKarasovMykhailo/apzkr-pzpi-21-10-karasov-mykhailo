import {BelongsToMany, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import User from "./User";
import UserEducations from "./UserEducations";
import Activity from "./Activity";


@Table({tableName: 'education'})
export default class Education extends Model {

    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id!: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    educationTitle!: string;

    @Column({type: DataType.STRING, allowNull: true})
    description!: string | null;

    @BelongsToMany(() => User, () => UserEducations)
    users!: User[];

    @HasMany(() => Activity)
    activities!: Activity[];

}