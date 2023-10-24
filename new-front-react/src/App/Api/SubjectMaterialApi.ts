import {baseApi} from "./BaseApi";
import {AppDispatch} from "../store";
import {AxiosInstance} from "axios";
import SubjectFileTypes from "../../Models/Subject/SubjectFileTypes";

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
        deleteSubjectMaterial: builder.mutation<boolean, { id: number, subjectId: number }>({
            query: arg => ({
                url: 'subjectFile/' + arg.id,
                method: 'delete'
            }),
            invalidatesTags: (result, error, arg) => ['doctor', {type: 'subject', id: arg.subjectId}]
        })
    })
})

//todo handle it with better way, may be with rtk query with axios
export const useAddSubjectMaterialMutation = (dispatch: AppDispatch, api: AxiosInstance) => {
    return async (data: FormData) => {
        const response = await api.post<boolean>('subjectFile', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        dispatch(baseApi.util.invalidateTags([
            'doctor',
            {type: 'subject', id: +data.get('subjectId')!}
        ]))
        return response
    }
}
export const useDownloadSubjectMaterial = (api: AxiosInstance) =>
    async (name: string) =>
        await api.get<Blob>('subjectFile/' + name, {responseType: 'blob'})


export const useDownloadSubjectFileTypeTemplate = (api: AxiosInstance) =>
    (type: keyof typeof SubjectFileTypes) =>
        api.get<Blob>('subjectFile/Template/' + type, {responseType: "blob"})

export const useUploadSubjectFileTypeTemplate = (api: AxiosInstance) =>
    async (d: FormData) =>
        await api.post<boolean>('subjectFile/Template', d, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })


export const downloadFile = (blobParts: Blob, name: string) => {
    const url = window.URL.createObjectURL(new Blob([blobParts]));
    const link = document.createElement('a');
    link.href = url
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click()
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

export const {
    useDeleteSubjectMaterialMutation,
    useGetSubjectMaterialQuery,
    useLazyGetSubjectMaterialQuery
} = subjectMaterialApi;