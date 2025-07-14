import axios from 'axios';
import { IProductRejectPayload, IServerResponse} from "@/interfaces";

const API_BASE_URL = 'products';

const moderatorApi = {
    approve(id: string) {
        return axios.patch<IServerResponse<{}>>(`${API_BASE_URL}/${id}/approve`);
    },
    reject(data: IProductRejectPayload) {
        return axios.patch(`${API_BASE_URL}/${data.id}/reject`, { rejectionReason: data.reason });
    },
    rejectAndBlockUser(data: IProductRejectPayload) {
        return axios.patch<IServerResponse<any>>(`${API_BASE_URL}/${data.id}/rejectAndBlockUser`, { rejectionReason: data.reason })
    }
};

export default moderatorApi;
