import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios';
import { IAxiosInstance, IServerError } from '../interfaces';

const DEFAULT_ERROR: IServerError = {
    code: 'SERVER__ERROR',
    message: 'SERVER__ERROR',
    data: {},
};

const axiosOptions: AxiosRequestConfig = {
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}:3000/api/v1/`,
    // withCredentials: false, // Uncomment if needed
};

const axiosInstance: AxiosInstance = axios.create(axiosOptions);

axiosInstance.interceptors.request.use(
    (reqConfig: InternalAxiosRequestConfig) => {
        const jwt = localStorage.getItem('token');

        if (jwt && reqConfig.headers) {
            reqConfig.headers.Authorization = jwt;
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
            return {
                token: headers.authorization,
                ...data,
            };
        }

        return data;
    },
    (failedResponse: AxiosError) => {
        const { response } = failedResponse;

        if (!response || !response.data) {
            throw DEFAULT_ERROR;
        }

        throw response.data;
    }
);

export default axiosInstance as IAxiosInstance;
