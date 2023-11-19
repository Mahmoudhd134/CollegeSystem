export interface MailModel {
    id: number;
    title: string;
    content: string;
    date: string;
    senderId: string;
    senderUsername: string;
    receiverId: string;
    receiverUsername: string;
}