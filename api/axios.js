import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"

const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      return "";
    }
  };


 const axiosInstance = axios.create({
        baseURL: `https://asset-manager-be-production.up.railway.app/api/v1`
    })
axiosInstance.interceptors.request.use(async (config) => {
    const token = await getAuthToken();
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (err) => {
    Promise.reject(err);
})

export default axiosInstance;
