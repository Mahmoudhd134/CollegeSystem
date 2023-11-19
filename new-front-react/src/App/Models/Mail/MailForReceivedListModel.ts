import {MailForSendListModel} from "./MailForSendListModel";

export interface MailForReceivedListModel extends MailForSendListModel {
    read: boolean;
}