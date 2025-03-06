import axios from 'axios';
import { IRegion, IRegions, IRegionUpdatePayload, IServerResponse } from "../interfaces";

const regionsApi = {
    async getRegion(id: string | string[]) {
        const result = await axios.get<IServerResponse<IRegion>>(`regions/admin/${id}`);
        return result.data;
    },
    async getRegions(query: string){
        const result = await axios.get<IServerResponse<IRegions>>(`regions/admin${query}`);
        return result.data;
    },
    async create(data: IRegion) {
        const result = await axios.post<IServerResponse<IRegions>>(`regions`, data);
        return result.data;
    },
    async update(data: IRegionUpdatePayload) {
        const result  = await axios.put<IServerResponse<IRegion>>(`regions/${data.id}`, data.data);
        return result.data;
    },
    delete(id: string) {
        return axios.delete(`regions/${id}`);
    }
};

export default regionsApi;
