import axios from 'axios';
import { IAgencyType, IAgencyTypes, IAgencyTypeUpdatePayload, IServerResponse } from "@/interfaces";

const API_BASE_URL = 'agencyType'

const agencyTypesApi = {
    async getAgencyType(id: string | string[]) {
        const result = await axios.get<IServerResponse<IAgencyType>>(`${API_BASE_URL}/admin/${id}`);
        return result.data;
    },
    async getAgencyTypes(query: string){
        const result = await axios.get<IServerResponse<IAgencyTypes>>(`${API_BASE_URL}/admin${query}`);
        return result.data;
    },
    async create(data: IAgencyType) {
        const result = await axios.post<IServerResponse<IAgencyTypes>>(`${API_BASE_URL}`, data);
        return result.data;
    },
    async update(data: IAgencyTypeUpdatePayload) {
        const result  = await axios.put<IServerResponse<IAgencyType>>(`${API_BASE_URL}/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
        return axios.delete(`${API_BASE_URL}/${id}`);
    }
};

export default agencyTypesApi;
