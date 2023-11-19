import SenderModel from "../Message/SenderModel";

export default interface NewMessageNotificationModel {
    first100Char: string;
    date: Date;
    roomId: string;
    roomName: string;
    subjectCode: number;
    subjectName: string;
    sender: SenderModel
}