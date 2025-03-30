import axios from 'axios';
import { IProductParameter, IProductParameters, IProductParametersUpdatePayload, IServerResponse } from "@/interfaces";

const API_BASE_URL = 'productParameters'

const productParametersApi = {
    async getProductParameter(id: string | string[]) {
        const result = await axios.get<IServerResponse<IProductParameter>>(`${API_BASE_URL}/admin/${id}`);
        return result.data;
    },
    async getProductParameters(query: string){
        const result = await axios.get<IServerResponse<IProductParameters>>(`${API_BASE_URL}/admin${query}`);
        return result.data;
    },
    async create(data: IProductParameter) {
        const result = await axios.post<IServerResponse<IProductParameter>>(`${API_BASE_URL}`, data);
        return result.data;
    },
    async update(data: IProductParametersUpdatePayload) {
        const result  = await axios.put<IServerResponse<IProductParameter>>(`${API_BASE_URL}/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
        return axios.delete(`${API_BASE_URL}/${id}`)
    }
};

export default productParametersApi;
