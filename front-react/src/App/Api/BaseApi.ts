import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from '@reduxjs/toolkit/query/react'
import {logout, setCredentials} from '../../Feutures/Auth/authSlice'
import {RootState} from '../store'
import useRefreshToken from '../../Hookes/useRefreshToken'

export interface AppError {
    code: string,
    message: string
}

// export const BASE_URL = 'https://localhost:7035/api/'
export const BASE_URL = 'http://localhost:5016/api/'
// export const BASE_URL = 'https://fjkdlasjfadj-001-site1.atempurl.com/api'

export const sendDefualt = fetchBaseQuery({
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
            const refreshToken = useRefreshToken()
            const data = await refreshToken()
            if (data) {
                api.dispatch(setCredentials(data))
            } else {
                api.dispatch(logout())
            }
        }
    }
    return sendDefualt(args, api, extraOptions);
}

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['user', 'doctor', 'subject', 'message'],
    endpoints: () => ({}),
    keepUnusedDataFor: 0
})