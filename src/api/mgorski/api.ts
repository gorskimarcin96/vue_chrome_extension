import axios, {AxiosError} from "axios";
import {notify} from "../../utils/notification";

const api = axios.create({
    // @ts-ignore
    baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
})

api.interceptors.response.use((response) => response, (error: AxiosError) => {
    notify(error.toString());

    throw error;
});

export default api;
