import axios from 'axios';
import { IRegion, IRegions, IRegionUpdatePayload, IServerResponse } from "@/interfaces";

const API_BASE_URL = 'regions'

const regionsApi = {
    async getRegion(id: string | string[]) {
        const result = await axios.get<IServerResponse<IRegion>>(`${API_BASE_URL}/admin/${id}`);
        return result.data;
    },
    async getRegions(query: string){
        const result = await axios.get<IServerResponse<IRegions>>(`${API_BASE_URL}/admin${query}`);
        return result.data;
    },
    async create(data: IRegion) {
        const result = await axios.post<IServerResponse<IRegions>>(`${API_BASE_URL}`, data);
        return result.data;
    },
    async update(data: IRegionUpdatePayload) {
        const result  = await axios.put<IServerResponse<IRegion>>(`${API_BASE_URL}/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
        return axios.delete(`${API_BASE_URL}/${id}`);
    }
};

export default regionsApi;
