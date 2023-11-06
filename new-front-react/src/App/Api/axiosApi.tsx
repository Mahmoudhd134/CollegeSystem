import axios from "axios";

export const BASE_URL = 'http://localhost:5016/api/'
export const PROFILE_IMAGES_URL = 'http://localhost:5016/ProfileImages/'
// export const BASE_URL = 'https://qualityms-001-site1.gtempurl.com/api/'

export const axiosApi = axios.create({
    baseURL: BASE_URL.slice(0, -1),
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    maxBodyLength: Infinity,
    maxContentLength: Infinity
});
