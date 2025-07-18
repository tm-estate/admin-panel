import { CookieAttributes } from 'js-cookie'

export const TOKEN_COOKIE_NAME = 'token'
export const CHAT_TOKEN_COOKIE_NAME = 'chat_token'
export const COOKIE_OPTIONS: CookieAttributes = {
  expires: 7, // 7 days
  path: '/',
  sameSite: 'strict',
  //TODO: update on ssl setup
  // secure: process.env.NODE_ENV === 'production' // Secure in production
  secure: false, // Secure in production
}
