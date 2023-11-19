import RoomMessageModel from "../../Models/Message/RoomMessageModel";
import * as SignalR from "@microsoft/signalr";

export default interface RoomState {
    rooms: {
        [key: string]: RoomMessageModel[]
    }

    connection: SignalR.HubConnection | null
}