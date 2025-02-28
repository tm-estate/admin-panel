import axios from 'axios';
import { IAgencyType, IAgencyTypes, IAgencyTypeUpdatePayload, IServerResponse } from "../interfaces";

const agencyTypesApi = {
    async getAgencyType(id: string | string[]) {
        const result = await axios.get<IServerResponse<IAgencyType>>(`agencyType/admin/${id}`);
        return result.data;
    },
    async getAgencyTypes(query: string){
        const result = await axios.get<IServerResponse<IAgencyTypes>>(`agencyType/admin${query}`);
        return result.data;
    },
    async create(data: IAgencyType) {
        const result = await axios.post<IServerResponse<IAgencyTypes>>(`agencyType`, data);
        return result.data;
    },
    async update(data: IAgencyTypeUpdatePayload) {
        const result  = await axios.put<IServerResponse<IAgencyType>>(`agencyType/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
        return axios.delete(`agencyType/${id}`);
    }
};

export default agencyTypesApi;
