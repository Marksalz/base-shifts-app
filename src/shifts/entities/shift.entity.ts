import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Assignment } from '../../assignments/entities/assignment.entity';

@Table({
    tableName: 'shifts',
    timestamps: true,
})
export class Shift extends Model {
    // @Column({
    //     type: DataType.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true,
    // })
    // declare id: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare startTime: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare endTime: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare location: string;

    @HasMany(() => Assignment)
    declare assignments: Assignment[];
}