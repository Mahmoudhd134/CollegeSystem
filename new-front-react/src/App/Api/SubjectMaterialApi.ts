import {baseApi} from "./BaseApi";
import {AppDispatch} from "../store";
import {AxiosInstance } from "axios";

export const subjectMaterialApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubjectMaterial: builder.query<Blob, string>({
            query: arg => ({url: 'subjectFile/' + arg})
        }),
        addSubjectMaterial: builder.mutation<boolean, FormData>({
            query: arg => ({
                url: 'subjectMaterial',
                method: 'post',
                data: arg,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }),
            invalidatesTags: (result, error, arg) => ['doctor', {type: 'subject', id: +arg.get('subjectId')!}]
        }),
        deleteSubjectMaterial: builder.mutation<boolean, { id: number, subjectCode: number }>({
            query: arg => ({
                url: 'subjectFile/' + arg.id,
                method: 'delete'
            }),
            invalidatesTags: (result, error, arg) => ['doctor', {type: 'subject', id: arg.subjectCode}]
        })
    })
})

//todo handle it with better way, may be with rtk query with axios
export const useAddSubjectMaterialMutation = (dispatch: AppDispatch, api: AxiosInstance, subjectCode: number) => {
    return async (data: FormData) => {
        const response = await api.post<boolean>('subjectFile', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        dispatch(baseApi.util.invalidateTags([
            'doctor',
            {type: 'subject', id: subjectCode}
        ]))
        return response
    }
}

export const useUploadSubjectFileTypeTemplate = (api: AxiosInstance) =>
    async (d: FormData) =>
        await api.post<boolean>('subjectFile/Template', d, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

export const {
    useDeleteSubjectMaterialMutation,
    useGetSubjectMaterialQuery,
    useLazyGetSubjectMaterialQuery
} = subjectMaterialApi;