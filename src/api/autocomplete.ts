import { IServerResponse } from "@/interfaces";
import axios from "axios";

export const getAutocompleteData = async <T>(endpoint: string): Promise<IServerResponse<T>> => {
    try {
        const result = await axios.get<IServerResponse<T>>(`${endpoint}/autocomplete`);
        return result.data;
    } catch (error) {
        console.error(`Error fetching autocomplete data for ${endpoint}:`, error);
        throw error;
    }
};
