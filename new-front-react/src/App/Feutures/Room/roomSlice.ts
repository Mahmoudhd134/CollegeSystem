﻿import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import RoomMessageModel from "../../Models/Message/RoomMessageModel";
import RoomState from "./roomState";
import * as SignalR from "@microsoft/signalr";
import {SERVER_HOST_NAME} from "../../Api/axiosApi";
import AddMessageModel from "../../Models/Message/AddMessageModel";
import {AxiosInstance} from "axios";
import MessageStateModel from "../../Models/Message/MessageStateModel";

const initialState: RoomState = {
    rooms: {},
    connection: null
}
const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        buildRoomConnection: (state, {payload: {roomId, token}}: PayloadAction<{ roomId: string, token: string }>) => {
            state.connection = new SignalR.HubConnectionBuilder()
                .withUrl(`${SERVER_HOST_NAME}/hub/room?roomId=${roomId}`, {
                    accessTokenFactory: () => token
                })
                .withAutomaticReconnect()
                .build()
        },
        startRoomConnection: state => {
            state.connection?.start()
                .catch(e => console.error('Error in connection => ', e))
        },
        stopRoomConnection: state => {
            state.connection?.stop()
                .catch(e => console.error('Connection stop unsuccessfully => ', e))
        },
        addMessage: (state, {payload}: PayloadAction<RoomMessageModel>) => {
            const {roomId, id} = payload
            if (state.rooms[roomId] == undefined)
                state.rooms[roomId] = []
            state.rooms[roomId].findIndex(m => m.id == id) == -1 && state.rooms[roomId].push(payload)
        },
        updateTempMessage: (state, action: PayloadAction<{ tempId: string, message: RoomMessageModel }>) => {
            const {tempId, message} = action.payload
            state.rooms[message.roomId] = state.rooms[message.roomId].map(m => m.id == tempId ? ({
                ...message,
                serverReached: true
            }) : m)
        },
        makeMessagesIsReadToTrue: (state, action: PayloadAction<{ ids: string[], roomId: string }>) => {
            const {ids, roomId} = action.payload
            state.rooms[roomId] = state.rooms[roomId].map(m => ids.indexOf(m.id) === -1 ? m : ({
                ...m,
                isRead: true,
                isDelivered: true
            }))
        },
        makeMessageIsDeliveredToTrue: (state, action: PayloadAction<{ ids: string[], roomId: string }>) => {
            const {ids, roomId} = action.payload
            state.rooms[roomId] = state.rooms[roomId].map(m => ids.indexOf(m.id) === -1 ? m : ({
                ...m,
                isDelivered: true
            }))
        },
        resetRoomState: () => initialState
    },
    extraReducers: builder => {
        builder.addCase(getUnReadMessageForRoom.fulfilled, (state, action: PayloadAction<{ roomId: string, messages: RoomMessageModel[] }>) => {
            const {roomId, messages} = action.payload
            if (state.rooms[roomId] == undefined)
                state.rooms[roomId] = []
            state.rooms[roomId].push(...messages)
        })

        builder.addCase(updateMessagesState.fulfilled, (state, action: PayloadAction<MessageStateModel[]>) => {
            const roomId = action.payload[0]?.roomId
            if (!roomId)
                return
            state.rooms[roomId] = state.rooms[roomId].map(m => {
                const index = action.payload.findIndex(x => x.id == m.id)
                if (index == -1)
                    return m

                const newMessage = action.payload[index]
                return {
                    ...m,
                    isDelivered: newMessage.isDelivered,
                    isRead: newMessage.isRead
                }
            })
        })

        builder.addCase(loadMoreMessages.fulfilled, (state, action: PayloadAction<{ messages: RoomMessageModel[], roomId: string }>) => {
            state.rooms[action.payload.roomId]?.unshift(...action.payload.messages)
        })
    }
})

export const getUnReadMessageForRoom = createAsyncThunk('room/getUnReadMessages', async (params: { api: AxiosInstance, roomId: string }) => {
    const {api, roomId} = params
    const {data: messages} = await api.get<RoomMessageModel[]>('room/un-read-messages/' + roomId)
    return {
        roomId,
        messages
    }
})

export const updateMessagesState = createAsyncThunk('room/getMessagesState', async (props: { api: AxiosInstance, ids: string[] }) => {
    return (await props.api.post<MessageStateModel[]>('/Message/messages-state', {
        messages: props.ids
    })).data
})

export const loadMoreMessages = createAsyncThunk('room/loadMoreMessages', async (props: { api: AxiosInstance, messagesCount: number, date: Date, roomId: string }) => {
    const {api, messagesCount, date: dateTime, roomId} = props
    const {data} = (await api.get<RoomMessageModel[]>('/message/load-messages', {
        params: {
            messagesCount,
            dateTime,
            roomId
        }
    }))
    return {
        messages: data,
        roomId
    }
})


const RoomReducer = roomSlice.reducer
export default RoomReducer
export const {
    buildRoomConnection,
    startRoomConnection,
    stopRoomConnection,
    updateTempMessage,
    addMessage,
    makeMessagesIsReadToTrue,
    makeMessageIsDeliveredToTrue,
    resetRoomState
} = roomSlice.actions