import { IsString, IsEnum, IsNotEmpty, IsEmail } from 'class-validator';

export enum UserRole {
    SOLDIER = 'soldier',
    COMMANDER = 'commander'
}

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}