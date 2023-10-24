import {SerializedError} from "@reduxjs/toolkit"
import {FetchBaseQueryError} from "@reduxjs/toolkit/dist/query"
import {AppError} from "../App/Api/BaseApi"
import {AxiosError} from "axios";

const useGetAppError = (error: FetchBaseQueryError | SerializedError | AxiosError | undefined) => {
    // if (typeof error == typeof AxiosError)
    //     return error?.response.data as AppError
    return error == undefined ? error : (error as FetchBaseQueryError).data as AppError
}

export default useGetAppError