import React, {useEffect} from 'react';
import useAppSelector from "./useAppSelector";
import {axiosApi} from "../App/Api/axiosApi";
import useRefreshToken from "./useRefreshToken";
import {logout, setCredentials} from "../Feutures/Auth/authSlice";
import useAppDispatch from "./useAppDispatch";

const UseAxiosApi = () => {
    const auth = useAppSelector(s => s.auth)
    const dispatch = useAppDispatch()
    const refreshToken = useRefreshToken()

    useEffect(() => {
        const requestInterceptor = axiosApi.interceptors.request.use(
            async (req) => {
                req.headers['Authorization'] = `Bearer ${auth.token}`;
                if (auth.tokenExp != null) {
                    const now = Math.floor(Date.now() / 1000);
                    if (now >= auth.tokenExp) {
                        const data = await refreshToken()
                        if (data) {
                            dispatch(setCredentials(data))
                            req.headers['Authorization'] = `Bearer ${data.token}`;
                        } else dispatch(logout())
                    }
                }
                return req;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return () => {
            axiosApi.interceptors.request.eject(requestInterceptor);
        };

    }, [auth])


    return axiosApi
};

export default UseAxiosApi;