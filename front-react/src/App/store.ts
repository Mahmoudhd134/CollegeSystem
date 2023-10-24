import {configureStore} from '@reduxjs/toolkit'
import {baseApi} from './Api/BaseApi'
import AuthReducer from '../Feutures/Auth/authSlice'

export const store = configureStore({
    reducer: {
        'auth': AuthReducer,
        [baseApi.reducerPath]: baseApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware)
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch