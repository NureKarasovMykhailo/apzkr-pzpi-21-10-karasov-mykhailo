import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import User from "./User";
import Scanner from "./Scanner";

@Table({tableName: 'scanner_history'})
export default class ScannerHistory extends Model {

    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id!: number;

    @Column({type: DataType.DOUBLE, allowNull: true})
    temperature!: number;

    @Column({type: DataType.DOUBLE, allowNull: true})
    pulse!: number;

    @Column({type: DataType.DOUBLE, allowNull: true})
    activeWorkedTime!: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: true})
    userId!: number | null;

    @ForeignKey(() => Scanner)
    @Column({type: DataType.INTEGER, allowNull: true})
    scannerId!: number | null;

    @BelongsTo(() => User)
    user!: User;

    @BelongsTo(() => Scanner)
    scanner!: Scanner;
}