import axios from 'axios';
import { ICities, ICity, ICityUpdatePayload, IServerResponse } from "@/interfaces";

const API_BASE_URL = 'cities'


const citiesApi = {
    async getCity(id: string | string[]) {
        const result = await axios.get<IServerResponse<ICity>>(`${API_BASE_URL}/${id}`);
        return result.data;
    },
    async getCities(query: string){
        const result = await axios.get<IServerResponse<ICities>>(`cities${query}`);
        return result.data;
    },
    async create(data: ICity) {
        const result = await axios.post<IServerResponse<ICities>>(`${API_BASE_URL}`, data);
        return result.data;
    },
    async update(data: ICityUpdatePayload) {
        const result  = await axios.put<IServerResponse<ICity>>(`${API_BASE_URL}/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
       return axios.delete(`${API_BASE_URL}/${id}`);
    }
};

export default citiesApi;
