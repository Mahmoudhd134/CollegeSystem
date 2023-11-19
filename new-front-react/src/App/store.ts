import {configureStore} from '@reduxjs/toolkit'
import {baseApi} from './Api/BaseApi'
import AuthReducer from './Feutures/Auth/authSlice'
import RoomReducer from './Feutures/Room/roomSlice'
import AppReducer from "./Feutures/App/AppSlice";

export const store = configureStore({
    reducer: {
        auth: AuthReducer,
        room: RoomReducer,
        app: AppReducer,
        [baseApi.reducerPath]: baseApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(baseApi.middleware)
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch