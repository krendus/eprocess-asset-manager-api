import axios from "./axios"

export const loginRequest = (data) => {
    return axios.post("/auth/login", data);
}
export const registerRequest = (data) => {
    return axios.post("/auth/register", data);
}
