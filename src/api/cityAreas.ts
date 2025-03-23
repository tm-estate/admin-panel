import axios from 'axios';
import { ICityArea, ICityAreas, ICityAreasUpdatePayload, IServerResponse } from "@/interfaces";

const cityAreasApi = {
    async getCityArea(id: string | string[]) {
        const result = await axios.get<IServerResponse<ICityArea>>(`cityAreas/${id}`);
        return result.data;
    },
    async getCityAreas(query: string){
        const result = await axios.get<IServerResponse<ICityAreas>>(`cityAreas${query}`);
        return result.data;
    },
    async create(data: ICityArea) {
        const result = await axios.post<IServerResponse<ICityArea>>(`cityAreas`, data);
        return result.data;
    },
    async update(data: ICityAreasUpdatePayload) {
        const result  = await axios.put<IServerResponse<ICityArea>>(`cityAreas/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
        return axios.delete(`cityAreas/${id}`)
    }
};

export default cityAreasApi;
