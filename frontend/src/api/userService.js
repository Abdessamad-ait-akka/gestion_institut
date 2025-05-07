import axios from 'axios';

const API = import.meta.env.VITE_USER_SERVICE_URL;

export const getUsers = () => axios.get(`${API}/users`);
export const createUser = (data) => axios.post(`${API}/users`, data);
export const updateUser = (id, data) => axios.put(`${API}/users/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API}/users/${id}`);
