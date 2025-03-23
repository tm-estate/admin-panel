import axios from 'axios';
import {IUser, IUsers, IServerResponse, IUserUpdatePayload,} from "@/interfaces";

const usersApi = {
    async getUser(id: string | string[]) {
        const result = await axios.get<IServerResponse<IUser>>(`users/${id}`);
        return result.data;
    },
    async getUsers(query: string, data){
        const result = await axios.post<IServerResponse<IUsers>>(`users/admin${query}`, data);
        return result.data;
    },
    async create(data: IUser) {
        const result = await axios.post<IServerResponse<IUsers>>(`users`, data);
        return result.data;
    },
    async update(data: IUserUpdatePayload) {
        const result  = await axios.put<IServerResponse<IUser>>(`users/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
        return axios.delete(`cities/${id}`);
    }
};

export default usersApi;
