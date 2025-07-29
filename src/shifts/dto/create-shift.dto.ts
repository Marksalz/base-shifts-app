import { IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class CreateShiftDto {
    @IsDateString()
    startTime: Date;

    @IsDateString()
    endTime: Date;

    @IsString()
    @IsNotEmpty()
    location: string;
}