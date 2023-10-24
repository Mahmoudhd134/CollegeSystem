import {baseApi} from "./BaseApi";
import LoginModel from "../../Models/Auth/LoginModel";
import TokenModel from "../../Models/Auth/TokenModel";
import RegisterModel from "../../Models/Auth/RegisterModel";
import ChangePasswordModel from "../../Models/Auth/ChangePasswordModel";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<TokenModel, LoginModel>({
            query: (cred) => ({
                url: '/auth/login',
                method: 'Post',
                body: cred
            }),
        }),
        signup: builder.mutation<boolean, RegisterModel>({
            query: (data) => ({
                url: '/auth/register',
                method: 'Post',
                body: data
            }),
        }),
        changePassword: builder.mutation<boolean, ChangePasswordModel>({
            query: arg => ({
                url: '/auth/changePassword',
                method: 'post',
                body: arg
            })
        })
    })
})

export const {
    useLoginMutation,
    useSignupMutation,
    useChangePasswordMutation
} = authApi