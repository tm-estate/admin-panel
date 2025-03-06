import axios from 'axios';
import { IProductParameter, IProductParameters, IProductParametersUpdatePayload, IServerResponse } from "../interfaces";
import { getAutocompleteData } from "./autocomplete";

const productParametersApi = {
    async getProductParameter(id: string | string[]) {
        const result = await axios.get<IServerResponse<IProductParameter>>(`productParameters/admin/${id}`);
        return result.data;
    },
    async getProductParametersAutocomplete() {
        return getAutocompleteData<IProductParameter[]>('productParameters');
    },
    async getProductParameters(query: string){
        const result = await axios.get<IServerResponse<IProductParameters>>(`productParameters/admin${query}`);
        return result.data;
    },
    async create(data: IProductParameter) {
        const result = await axios.post<IServerResponse<IProductParameter>>(`productParameters`, data);
        return result.data;
    },
    async update(data: IProductParametersUpdatePayload) {
        const result  = await axios.put<IServerResponse<IProductParameter>>(`productParameters/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
        return axios.delete(`productParameters/${id}`)
    }
};

export default productParametersApi;
