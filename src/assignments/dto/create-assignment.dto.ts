import { IsNumber, IsPositive } from 'class-validator';

export class CreateAssignmentDto {
    @IsNumber()
    @IsPositive()
    userId: number;

    @IsNumber()
    @IsPositive()
    shiftId: number;
}
