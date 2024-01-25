import axios from "./axios"

export const createAssetRequest = (data) => {
    return axios.post("/assets", data);
}
export const getSingleAssetRequest = (id) => {
    return axios.get(`/assets/${id}`);
}
export const getAllAssetRequest = () => {
    return axios.get("/assets");
}
export const returnAssetRequest = (data) => {
    return axios.patch("/assets", data);
}
