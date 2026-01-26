import axios from 'axios';

const token = JSON.parse(localStorage.getItem('token')) || '';
export const apiClient = axios.create({
    baseURL: 'https://backendretofactus-production.up.railway.app/api',
    withCredentials: true
});