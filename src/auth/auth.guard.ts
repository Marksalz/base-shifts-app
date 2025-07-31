import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromCookies(request);

        if (!token) {
            throw new UnauthorizedException('No authentication token found');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });

            const userId = payload.sub;
            const role = payload.role;
            const username = payload.username;

            request['user'] = {
                id: userId,
                username: username,
                role: role,
            };

            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private extractTokenFromCookies(request: Request): string | undefined {
        return request.cookies?.jwt_token;
    }
}
