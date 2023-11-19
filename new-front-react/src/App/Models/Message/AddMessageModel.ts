import SenderModel from "./SenderModel";

export default interface AddMessageModel {
    tempId:string;
    text: string;
    roomId: string;
    sender:SenderModel
}

