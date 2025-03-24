import axios from 'axios';
import {IUser, IUsers, IServerResponse, IUserUpdatePayload,} from "@/interfaces";

const API_BASE_URL = 'users'

const usersApi = {
    async getUser(id: string | string[]) {
        const result = await axios.get<IServerResponse<IUser>>(`${API_BASE_URL}/${id}`);
        return result.data;
    },
    async getUsers(query: string, data){
        const result = await axios.post<IServerResponse<IUsers>>(`${API_BASE_URL}/admin${query}`, data);
        return result.data;
    },
    async create(data: IUser) {
        const result = await axios.post<IServerResponse<IUsers>>(`${API_BASE_URL}`, data);
        return result.data;
    },
    async update(data: IUserUpdatePayload) {
        const result  = await axios.put<IServerResponse<IUser>>(`${API_BASE_URL}/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
        return axios.delete(`cities/${id}`);
    }
};

export default usersApi;
