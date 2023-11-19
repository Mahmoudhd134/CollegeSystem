import * as SignalR from '@microsoft/signalr'
import NewMessageNotificationModel from "../../Models/App/NewMessageNotificationModel";
import DelayedSubjectMessageInfoModel from "../../Models/App/DelayedSubjectMessageInfoModel";

export default interface AppState {
    connection: SignalR.HubConnection | null
    messageNotifications: NewMessageNotificationModel[]
    delayedSubjectMessage: DelayedSubjectMessageInfoModel[]
}