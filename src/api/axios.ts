import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios';
import { IAxiosInstance, IServerError } from '@/interfaces';
import Cookies from 'js-cookie';
import { COOKIE_OPTIONS } from "@/constants/cookies";

const DEFAULT_ERROR: IServerError = {
    code: 'SERVER__ERROR',
    message: 'SERVER__ERROR',
    data: {},
};

const axiosOptions: AxiosRequestConfig = {
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}:3000/api/v1/`,
    // withCredentials: true, // Enable if your API is on a different domain and needs to send cookies
};

const axiosInstance: AxiosInstance = axios.create(axiosOptions);

axiosInstance.interceptors.request.use(
    (reqConfig: InternalAxiosRequestConfig) => {
        // Get token from cookies instead of localStorage
        const token = Cookies.get('token');

        if (token && reqConfig.headers) {
            reqConfig.headers.Authorization = token;
        }

        return reqConfig;
    },
    (err: AxiosError) => {
        return Promise.reject(err);
    }
);

axiosInstance.interceptors.response.use(
    (successResponse: AxiosResponse) => {
        const { data, headers } = successResponse;

        if (!data) {
            throw DEFAULT_ERROR;
        }

        if (headers.authorization) {
            // If response includes a new token, update the cookie
            Cookies.set('token', headers.authorization, COOKIE_OPTIONS);

            return {
                token: headers.authorization,
                ...data,
            };
        }

        return data;
    },
    (failedResponse: AxiosError) => {
        const { response } = failedResponse;

        // If unauthorized (401), clear the token cookie
        if (response?.status === 401) {
            Cookies.remove('token', { path: '/' });
        }

        if (!response || !response.data) {
            throw DEFAULT_ERROR;
        }

        throw response.data;
    }
);

export default axiosInstance as IAxiosInstance;
