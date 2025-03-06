import axios from 'axios';
import { IProduct, IProducts, IProductUpdatePayload, IServerResponse } from "@/interfaces";

const productsApi = {
    async getProduct(id: string | string[]) {
        const result = await axios.get<IServerResponse<IProduct>>(`products/admin/${id}`);
        return result.data;
    },
    async getProducts(query: string){
        const result = await axios.get<IServerResponse<IProducts>>(`products/admin${query}`);
        return result.data;
    },
    async create(data: IProduct) {
        const result = await axios.post<IServerResponse<IProducts>>(`products`, data);
        return result.data;
    },
    async update(data: IProductUpdatePayload) {
        const result  = await axios.put<IServerResponse<IProduct>>(`products/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
        return axios.delete(`products/${id}`);
    }
};

export default productsApi;
