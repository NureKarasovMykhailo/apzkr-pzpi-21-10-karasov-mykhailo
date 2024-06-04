import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import User from "./User";
import Complexity from "./Complexity";
import Education from "./Education";
import Company from "./Company";
import UserActivities from "./UserActivities";


@Table({tableName: 'activity'})
export default class Activity extends Model {

    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id!: number;

    @Column({type: DataType.STRING, allowNull: false})
    activityTitle!: string;

    @Column({type: DataType.STRING, allowNull: true})
    description!: string | null;

    @Column({type: DataType.INTEGER, allowNull: false})
    requiredWorkersCount!: number

    @Column({type: DataType.DOUBLE, allowNull: false})
    timeShift!: number;

    @ForeignKey(() => Complexity)
    @Column({type: DataType.INTEGER, allowNull: true})
    complexityId!: number | null;

    @ForeignKey(() => Education)
    @Column({type: DataType.INTEGER, allowNull: true})
    educationId!: number | null;

    @ForeignKey(() => Company)
    @Column({type: DataType.INTEGER, allowNull: true})
    companyId!: number | null;

    @BelongsTo(() => Complexity)
    complexity!: Complexity | null;

    @BelongsTo(() => Education)
    education!: Education | null;

    @BelongsToMany(() => User, () => UserActivities)
    users!: User[] | null;

    @BelongsTo(() => Company)
    company!: Company | null;

}