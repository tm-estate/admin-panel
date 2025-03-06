import { IUser } from './IUsers';

export interface ISignUpPayload {
    name: string;
    phone: string;
    email: string;
    password: string;
}

export interface ISignInPayload {
    login: string;
    password: string;
}

export interface IForgotPasswordPayload {
    email: string;
    url: string;
}

export interface IResetPasswordPayload {
    password: string;
    token: string;
}

export interface IServerError<T = Record<string, unknown>> {
    code: string;
    message?: string;
    data: T;
}

export interface IAuth {
    token: string;
    data: IUser;
}

export interface IConfirmCode {
    data: {
        code: string;
    };
}

export interface ISuccessResponse<T> {
    data: T;
    statusCode: number;
    message: string;
}
