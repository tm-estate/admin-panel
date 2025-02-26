export interface IServerResponse<T> {
    data: T;
    message: string
    statusCode: number
    // Add other common response fields if needed (status, message, etc.)
}

