import {BASE_URL} from "../App/Api/axiosApi"
import TokenModel from "../App/Models/Auth/TokenModel";
import axios from "axios";

const useRefreshToken = () => {
    return async () => {
        try {
            const refreshToken = await axios.get<TokenModel>(`${BASE_URL}auth/RefreshToken`, {
                withCredentials: true
            })
            return refreshToken.data;
        } catch (e) {
            throw e
        }
    }
}

export default useRefreshToken