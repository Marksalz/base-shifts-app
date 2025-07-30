import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        username: string;
        role: string;
    };
}

export interface UserPayload {
    id: number;
    username: string;
    role: string;
}