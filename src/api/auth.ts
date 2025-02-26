import axios from './axios';
import {
  IAuth,
  IConfirmCode,
  IForgotPasswordPayload,
  IResetPasswordPayload,
  ISignInPayload,
  ISignUpPayload,
  IUser
} from '../interfaces';

const authApi = {
  login(data: ISignInPayload) {
    return axios.post<IAuth>('auth/login', data);
  },
  register(data: ISignUpPayload) {
    return axios.post<IAuth>('auth/register', data);
  },
  getMe() {
    return axios.get<IUser>('auth/me');
  },
  getConfirmCode() {
    return axios.post<IConfirmCode>('auth/verifyCode');
  },
  confirmCode(code: string) {
    return axios.post('auth/confirm-verifyCode', { code });
  },
  forgotPassword(data: IForgotPasswordPayload) {
    return axios.post('auth/forgot-password', data);
  },
  resetPassword(data: IResetPasswordPayload) {
    return axios.post('auth/reset-password', data);
  },
  async logout() {
    localStorage.removeItem('token'); // maybe user
  }
};

export default authApi;
