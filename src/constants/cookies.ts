import { CookieAttributes } from "js-cookie";

export const TOKEN_COOKIE_NAME = 'token';
export const COOKIE_OPTIONS: CookieAttributes = {
    expires: 7, // 7 days
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production' // Secure in production
};
