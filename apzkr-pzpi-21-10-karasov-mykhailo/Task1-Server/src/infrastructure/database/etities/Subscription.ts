import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import User from "./User";
import {Col} from "sequelize/types/utils";


@Table({tableName: 'subscription'})
export default class Subscription extends Model {

    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id!: number;

    @Column({type: DataType.STRING, allowNull: false, unique: true})
    code!: string;

    @Column({type: DataType.DATEONLY, allowNull: false})
    validUntil!: Date;

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    isValid!: boolean;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: true})
    userId!: number | null;

    @BelongsTo(() => User)
    user!: User;
}