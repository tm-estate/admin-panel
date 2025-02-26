import axios from 'axios';
import { IPropertyType, IPropertyTypes, IPropertyTypeUpdatePayload, IServerResponse } from "../interfaces";

const propertyTypesApi = {
    async getPropertyType(id: string | string[]) {
        const result = await axios.get<IServerResponse<IPropertyType>>(`propertyTypes/admin/${id}`);
        return result.data;
    },
    async getPropertyTypes(query: string){
        const result = await axios.get<IServerResponse<IPropertyTypes>>(`propertyTypes/admin${query}`);
        return result.data;
    },
    async create(data: IPropertyType) {
        const result = await axios.post<IServerResponse<IPropertyTypes>>(`propertyTypes`, data);
        return result.data;
    },
    async update(data: IPropertyTypeUpdatePayload) {
        const result  = await axios.put<IServerResponse<IPropertyType>>(`propertyTypes/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
        return axios.delete(`propertyTypes/${id}`);
    }
};

export default propertyTypesApi;
