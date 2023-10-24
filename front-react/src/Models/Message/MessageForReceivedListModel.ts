import {MessageForSendListModel} from "./MessageForSendListModel";

export interface MessageForReceivedListModel extends MessageForSendListModel {
    read: boolean;
}