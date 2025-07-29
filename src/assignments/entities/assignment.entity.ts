import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Shift } from '../../shifts/entities/shift.entity';

@Table({
    tableName: 'assignments',
    timestamps: true,
})
export class Assignment extends Model {
    // @Column({
    //     type: DataType.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true,
    // })
    // declare id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare userId: number;

    @ForeignKey(() => Shift)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare shiftId: number;

    @BelongsTo(() => User)
    declare user: User;

    @BelongsTo(() => Shift)
    declare shift: Shift;
}