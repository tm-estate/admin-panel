import axios from 'axios';
import { IProduct, IProducts, IProductUpdatePayload, IServerResponse } from "@/interfaces";

const API_BASE_URL = 'products';

const productsApi = {
    async getProduct(id: string | string[]) {
        const result = await axios.get<IServerResponse<IProduct>>(`${API_BASE_URL}/admin/${id}`);
        return result.data;
    },
    async getProducts(query: string, data){
        const result = await axios.post<IServerResponse<IProducts>>(`${API_BASE_URL}/admin${query}`, data);
        return result.data;
    },
    async create(data: IProduct) {
        const result = await axios.post<IServerResponse<IProducts>>(`${API_BASE_URL}`, data);
        return result.data;
    },
    async update(data: IProductUpdatePayload) {
        const result  = await axios.put<IServerResponse<IProduct>>(`${API_BASE_URL}/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
        return axios.delete(`${API_BASE_URL}/${id}`);
    }
};

export default productsApi;
