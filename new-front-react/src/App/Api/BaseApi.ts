import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from '@reduxjs/toolkit/query/react'
import {logout, setCredentials} from '../../Feutures/Auth/authSlice'
import {RootState} from '../store'
import useRefreshToken from '../../Hookes/useRefreshToken'
import {BASE_URL} from "./axiosApi";

export interface AppError {
    code: string,
    message: string
}


export const sendDefault = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, {getState}) => {
        const token = (getState() as RootState).auth.token
        if (token != null)
            headers.append('authorization', `Bearer ${token}`)
    }
})

const baseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const tokenExp = (api.getState() as RootState).auth.tokenExp
    if (tokenExp != null) {
        const now = +new Date().getTime().toString().slice(0, -3)
        if (now >= tokenExp) {
            try {
                const refreshToken = useRefreshToken()
                const data = await refreshToken()
                api.dispatch(setCredentials(data))
            } catch (e) {
                api.dispatch(logout())
            }
        }
    }
    return sendDefault(args, api, extraOptions);
}

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['user', 'doctor', 'subject', 'message','student'],
    endpoints: () => ({}),
    // keepUnusedDataFor: 0,
})