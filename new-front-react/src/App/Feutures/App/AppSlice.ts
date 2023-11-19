import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import AppState from "./AppState";
import * as SignalR from "@microsoft/signalr";
import {SERVER_HOST_NAME} from "../../Api/axiosApi";
import NewMessageNotificationModel from "../../Models/App/NewMessageNotificationModel";
import {AxiosInstance} from "axios";
import DelayedSubjectMessageInfoModel from "../../Models/App/DelayedSubjectMessageInfoModel";

const initialState: AppState = {
    connection: null,
    messageNotifications: [],
    delayedSubjectMessage: []
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        buildAppConnection: (state, {payload: {token}}: PayloadAction<{ token: string }>) => {
            state.connection = new SignalR.HubConnectionBuilder()
                .withUrl(`${SERVER_HOST_NAME}/hub/app`, {
                    accessTokenFactory: () => token
                })
                .withAutomaticReconnect()
                .build()
        },
        startAppConnection: state => {
            state.connection?.start()
                .catch(e => console.error('Error in connection => ', e))
        },
        stopAppConnection: state => {
            state.connection?.stop()
                .catch(e => console.error('Connection stop unsuccessfully => ', e))
        },
        addNewMessageNotification: (state, action: PayloadAction<NewMessageNotificationModel>) => {
            // @ts-ignore
            action.payload.date += 'Z'
            state.messageNotifications.unshift(action.payload)
        },
        removeNotificationsForRoom: (state, action: PayloadAction<string>) => {
            state.messageNotifications = state.messageNotifications.filter(n => n.roomId != action.payload)
        },
        resetAppState: () => initialState
    }, extraReducers: builder => {
        builder.addCase(getDelayedMessagesInfo.fulfilled, (state, action: PayloadAction<DelayedSubjectMessageInfoModel[]>) => {
            state.delayedSubjectMessage = action.payload
        })
    }
})

export const getDelayedMessagesInfo = createAsyncThunk('app/getDelayedMessages', async (props: { api: AxiosInstance }) => {
    return (await props.api.get<DelayedSubjectMessageInfoModel[]>('/user/delayed-messages-info')).data
})

const AppReducer = appSlice.reducer
export default AppReducer

export const {
    buildAppConnection,
    stopAppConnection,
    startAppConnection,
    addNewMessageNotification,
    removeNotificationsForRoom,
    resetAppState
} = appSlice.actions