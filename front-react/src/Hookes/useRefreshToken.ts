import {BASE_URL} from "../App/Api/BaseApi"
import TokenModel from "../Models/Auth/TokenModel";
import axios from "axios";

const useRefreshToken = () => {
    const refresh = async () => {
        try {
            const refreshToken = await axios.get<TokenModel>(`${BASE_URL}auth/RefreshToken`, {
                withCredentials: true
            })
            return refreshToken.data;
        } catch (e) {
            throw e
        }
    }
    return refresh
}

export default useRefreshToken