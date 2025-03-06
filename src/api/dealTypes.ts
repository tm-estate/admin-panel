import axios from 'axios';
import { IDealType, IDealTypes, IDealTypeUpdatePayload, IServerResponse } from "../interfaces";

const dealTypesApi = {
    async getDealType(id: string | string[]) {
        const result = await axios.get<IServerResponse<IDealType>>(`dealTypes/admin/${id}`);
        return result.data;
    },
    async getDealTypes(query: string){
        const result = await axios.get<IServerResponse<IDealTypes>>(`dealTypes/admin${query}`);
        return result.data;
    },
    async create(data: IDealType) {
        const result = await axios.post<IServerResponse<IDealTypes>>(`dealTypes`, data);
        return result.data;
    },
    async update(data: IDealTypeUpdatePayload) {
        const result  = await axios.put<IServerResponse<IDealType>>(`dealTypes/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
        return axios.delete(`dealTypes/${id}`);
    }
};

export default dealTypesApi;
