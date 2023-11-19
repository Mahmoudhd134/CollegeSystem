import axios from "axios";

export const SERVER_HOST_NAME = 'http://localhost:5016'
export const BASE_URL = SERVER_HOST_NAME + '/api/'
export const PROFILE_IMAGES_URL = SERVER_HOST_NAME + '/ProfileImages/'
export const ROOM_IMAGES_URL = SERVER_HOST_NAME + '/RoomImages/'

export const axiosApi = axios.create({
    baseURL: BASE_URL.slice(0, -1),
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    maxBodyLength: Infinity,
    maxContentLength: Infinity
});
