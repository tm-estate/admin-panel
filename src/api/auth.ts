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

const API_BASE_URL = 'auth'

const authApi = {
  login(data: ISignInPayload) {
    return axios.post<IAuth>(`${API_BASE_URL}/login`, data);
  },

  register(data: ISignUpPayload) {
    return axios.post<IAuth>(`${API_BASE_URL}/register`, data);
  },

  getMe() {
    return axios.get<IUser>(`${API_BASE_URL}/me`);
  },

  getConfirmCode() {
    return axios.post<IConfirmCode>(`${API_BASE_URL}/verifyCode`);
  },

  confirmCode(code: string) {
    return axios.post(`${API_BASE_URL}/confirm-verifyCode`, { code });
  },

  forgotPassword(data: IForgotPasswordPayload) {
    return axios.post(`${API_BASE_URL}/forgot-password`, data);
  },

  resetPassword(data: IResetPasswordPayload) {
    return axios.post(`${API_BASE_URL}/reset-password`, data);
  },

  changeUserRole(userId: string, role: Role) {
    return axios.post(`${API_BASE_URL}/change-role/${userId}`, { role });
  },

  assignPermission(userId: string, permission: Permission) {
    return axios.post(`${API_BASE_URL}/assign-permission/${userId}`, { permission });
  },

  removePermission(userId: string, permission: Permission) {
    return axios.post(`${API_BASE_URL}/remove-permission/${userId}`, { permission });
  },

  async logout() {
    Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });

    delete axios.defaults.headers.common['Authorization'];
  }
};

export default authApi;
