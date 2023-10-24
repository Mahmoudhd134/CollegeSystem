import axios from "axios";

// export const BASE_URL = 'https://localhost:7035/api/'
export const BASE_URL = 'http://localhost:5016/api/'
// export const BASE_URL = 'https://fjkdlasjfadj-001-site1.atempurl.com/api'
export const axiosApi = axios.create({
    baseURL: BASE_URL.slice(0, -1),
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});
