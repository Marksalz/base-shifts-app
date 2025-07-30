import { IsNumber, IsPositive } from 'class-validator';

export class LogoutDto {
  @IsNumber()
  @IsPositive()
  userId: number; // Use lowercase 'number' instead of 'Number'
}
