import {AxiosInstance} from "axios";
import {AppDispatch} from "../store";
import {baseApi} from "./BaseApi";

export const useChangeProfilePhoto = (api: AxiosInstance, dispatch: AppDispatch) => async (data: FormData, doctorId: string) => {
    const result = await api.post('user/changeProfilePhoto', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    dispatch(baseApi.util.invalidateTags([{type: 'doctor', id: doctorId}, {type: 'doctor', id: 'ME'}]))
    return result
}
