import axios from 'axios'
import wrapper from 'axios-cache-plugin'

const clientAxios = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
})

const api = wrapper(clientAxios, {
    maxCacheSize: 100,
    ttl: 600000,
})

export default api;
