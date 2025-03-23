export interface IServerResponse<T> {
    data: T;
    message: string
    statusCode: number
    // Add other common response fields if needed (status, message, etc.)
}

export interface IServerError<T = Record<string, unknown>> {
    code: string;
    message?: string;
    data: T;
}
