import axios from "axios";

const api = axios.create({
    // @ts-ignore
    baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
})

export default api;
