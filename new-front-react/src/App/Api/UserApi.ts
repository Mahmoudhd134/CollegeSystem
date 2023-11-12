import {AxiosInstance} from "axios";
import {AppDispatch} from "../store";
import {baseApi} from "./BaseApi";

export const useChangeProfilePhoto = (api: AxiosInstance, dispatch: AppDispatch) => async (data: FormData, id: string) => {
    const result = await api.post('user/changeProfilePhoto', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    dispatch(baseApi.util.invalidateTags([
        {type: 'doctor', id: id},
        {type: 'doctor', id: 'ME'},
        {type: 'student', id: id},
        {type: 'student', id: 'ME'}
    ]))
    return result
}
