export enum UserRole {
    SOLDIER = 'soldier',
    COMMANDER = 'commander'
}

export class SignupDto {
    username: string;
    password: string;
    role: UserRole;
}