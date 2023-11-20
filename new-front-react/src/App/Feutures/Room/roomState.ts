import RoomMessageModel from "../../Models/Message/RoomMessageModel";
import * as SignalR from "@microsoft/signalr";

export default interface RoomState {
    roomsMessages: {
        [key: string]: {
            hasMore: boolean,
            messages: RoomMessageModel[]
        }
    },
    loadCountAtOnce: number,
    connection: SignalR.HubConnection | null
}