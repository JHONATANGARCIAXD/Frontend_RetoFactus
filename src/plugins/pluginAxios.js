import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'https://backendretofactus-production.up.railway.app/api',
    withCredentials: true
});