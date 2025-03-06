import axios from 'axios';
import { ICities, ICity, ICityUpdatePayload, IServerResponse } from "../interfaces";

const citiesApi = {
    async getCity(id: string | string[]) {
        const result = await axios.get<IServerResponse<ICity>>(`cities/${id}`);
        return result.data;
    },
    async getCities(query: string){
        const result = await axios.get<IServerResponse<ICities>>(`cities${query}`);
        return result.data;
    },
    async create(data: ICity) {
        const result = await axios.post<IServerResponse<ICities>>(`cities`, data);
        return result.data;
    },
    async update(data: ICityUpdatePayload) {
        const result  = await axios.put<IServerResponse<ICity>>(`cities/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
       return axios.delete(`cities/${id}`);
    }
};

export default citiesApi;
