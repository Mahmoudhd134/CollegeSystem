import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import TokenModel from '../../Models/Auth/TokenModel'
import jwtDecode from "jwt-decode";

const initialState: TokenModel = {
    roles: null,
    token: null,
    tokenExp: null,
    username: null,
    id: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<Omit<TokenModel, 'tokenExp'>>) => {
            state.roles = action.payload.roles
            state.token = action.payload.token
            const token = (jwtDecode(action.payload.token!) as {
                exp: number,
                nameid: string,
                'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid': string
            })
            state.tokenExp = token?.exp
            state.id = token?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"]
            state.username = token?.nameid
        },
        logout: (state) => {
            localStorage.removeItem('stayLogin')
            state.roles = null
            state.token = null
            state.tokenExp = null
        }
    }
})

export default authSlice.reducer
export const {logout, setCredentials} = authSlice.actions