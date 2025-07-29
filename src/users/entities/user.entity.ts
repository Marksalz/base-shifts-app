import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Assignment } from '../../assignments/entities/assignment.entity';

export enum UserRole {
    SOLDIER = 'soldier',
    COMMANDER = 'commander'
}

@Table({
    tableName: 'users',
    timestamps: true,
})
export class User extends Model {
    // @Column({
    //     type: DataType.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true,
    // })
    // declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        allowNull: false,
    })
    declare role: UserRole;

    @HasMany(() => Assignment)
    declare assignments: Assignment[];
}
