import axios from 'axios';
import { IPropertyType, IPropertyTypes, IPropertyTypeUpdatePayload, IServerResponse } from "@/interfaces";

const API_BASE_URL = 'propertyTypes'

const propertyTypesApi = {
    async getPropertyType(id: string | string[]) {
        const result = await axios.get<IServerResponse<IPropertyType>>(`${API_BASE_URL}/admin/${id}`);
        return result.data;
    },
    async getPropertyTypes(query: string){
        const result = await axios.get<IServerResponse<IPropertyTypes>>(`${API_BASE_URL}/admin${query}`);
        return result.data;
    },
    async create(data: IPropertyType) {
        const result = await axios.post<IServerResponse<IPropertyTypes>>(`${API_BASE_URL}`, data);
        return result.data;
    },
    async update(data: IPropertyTypeUpdatePayload) {
        const result  = await axios.put<IServerResponse<IPropertyType>>(`${API_BASE_URL}/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
        return axios.delete(`${API_BASE_URL}/${id}`);
    }
};

export default propertyTypesApi;
