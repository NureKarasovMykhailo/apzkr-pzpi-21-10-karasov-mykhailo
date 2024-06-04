import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import Company from "./Company";
import ScannerHistory from "./ScannerHistory";
import User from "./User";


@Table({tableName: 'scanner'})
export default class Scanner extends Model {

    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id!: number;

    @Column({type: DataType.STRING, allowNull: true})
    description!: string | null;

    @ForeignKey(() => Company)
    @Column({type: DataType.INTEGER, allowNull: true})
    companyId!: number | null;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: true})
    userId!: number | null;

    @BelongsTo(() => Company)
    company!: Company | null;

    @BelongsTo(() => User)
    user!: User | null;

    @HasMany(() => ScannerHistory)
    scannerHistories!: ScannerHistory[]
}