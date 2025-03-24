import axios from 'axios';
import { IDealType, IDealTypes, IDealTypeUpdatePayload, IServerResponse } from "@/interfaces";

const API_BASE_URL = 'dealTypes'

const dealTypesApi = {
    async getDealType(id: string | string[]) {
        const result = await axios.get<IServerResponse<IDealType>>(`${API_BASE_URL}/admin/${id}`);
        return result.data;
    },
    async getDealTypes(query: string){
        const result = await axios.get<IServerResponse<IDealTypes>>(`${API_BASE_URL}/admin${query}`);
        return result.data;
    },
    async create(data: IDealType) {
        const result = await axios.post<IServerResponse<IDealTypes>>(`${API_BASE_URL}`, data);
        return result.data;
    },
    async update(data: IDealTypeUpdatePayload) {
        const result  = await axios.put<IServerResponse<IDealType>>(`${API_BASE_URL}/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
        return axios.delete(`${API_BASE_URL}/${id}`);
    }
};

export default dealTypesApi;
