import { IsString, IsEnum, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export enum UserRole {
    SOLDIER = 'soldier',
    COMMANDER = 'commander'
}

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}
