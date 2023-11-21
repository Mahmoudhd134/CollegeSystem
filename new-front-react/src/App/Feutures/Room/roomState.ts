import RoomMessageModel from "../../Models/Message/RoomMessageModel";
import * as SignalR from "@microsoft/signalr";

export default interface RoomState {
    roomsMessages: {
        [key: string]: RoomInstance
    },
    loadCountAtOnce: number,
    connection: SignalR.HubConnection | null
}

export interface RoomInstance {
    hasMore: boolean,
    messages: RoomMessageModel[],
    isLoading: boolean,
    isLoadedMore: boolean
}