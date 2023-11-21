import SenderModel from "./SenderModel";

export default interface RoomMessageModel {
    id: string;
    text: string;
    date: string;
    sender: SenderModel;
    roomId: string;
    
    serverReached:boolean;
    isRead: boolean;
}