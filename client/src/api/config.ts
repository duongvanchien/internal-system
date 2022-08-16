import axios from "axios";

export const PREFIX_API = process.env.REACT_APP_PREFIX_API;
export const ENDPOINT_LOCAL = process.env.REACT_APP_ENDPOINT;

const axiosInstant = axios.create();
axiosInstant.defaults.baseURL = `${ENDPOINT_LOCAL}/${PREFIX_API}`;
axiosInstant.defaults.withCredentials = true;
axiosInstant.defaults.timeout = 20000;
axiosInstant.defaults.headers = { "Content-Type": "application/json" };

export const ApiConfig = async (url: string, payload?: any) => {
    return await axiosInstant.post(`${url}`, payload)
        .then(response => response)
        .catch(error => error);
}