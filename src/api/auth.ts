import axios from './axios';
import {
  IAuth,
  IConfirmCode,
  IForgotPasswordPayload,
  IResetPasswordPayload,
  ISignInPayload,
  ISignUpPayload,
  IUser
} from '@/interfaces';
import { Role } from '@/constants/roles';
import { Permission } from '@/constants/permissions';
import {TOKEN_COOKIE_NAME} from "@/constants/cookies";
import Cookies from "js-cookie";

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

  changeUserRole(userId: string, role: Role) {
    return axios.post(`auth/change-role/${userId}`, { role });
  },

  assignPermission(userId: string, permission: Permission) {
    return axios.post(`auth/assign-permission/${userId}`, { permission });
  },

  removePermission(userId: string, permission: Permission) {
    return axios.post(`auth/remove-permission/${userId}`, { permission });
  },

  async logout() {
    Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });

    delete axios.defaults.headers.common['Authorization'];
  }
};

export default authApi;
