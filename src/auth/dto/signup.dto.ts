import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export enum UserRole {
    SOLDIER = 'soldier',
    COMMANDER = 'commander'
}

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}