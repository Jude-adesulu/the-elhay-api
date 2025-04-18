import { randomBytes } from "crypto";

export interface CustomApiResponse<T = any> {
    statusCode: number;
    message: string;
    data?: T;
    error?: string;
}

export function createResponse<T>(
    statusCode: number,
    message: string,
    data?: T,
    error?: string,
): CustomApiResponse<T> {
    return {
        statusCode,
        message,
        data,
        error,
    };
}
