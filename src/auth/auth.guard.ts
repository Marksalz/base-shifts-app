import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
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

            // Extract user_id and role from JWT payload
            const userId = payload.sub;
            const role = payload.role;
            const username = payload.username;

            // Attach user info to request for use in controllers
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

    private extractTokenFromCookies(request: Request, specificUserId?: number): string | undefined {
        const cookies = request.cookies;
        if (!cookies) return undefined;

        if (specificUserId) {
            // Check for a specific user's cookie
            return cookies[`jwt_user_${specificUserId}`];
        }

        // Find any JWT cookie that matches the pattern jwt_user_*
        for (const [key, value] of Object.entries(cookies)) {
            if (key.startsWith('jwt_user_') && value) {
                return value as string;
            }
        }

        return undefined;
    }
}
