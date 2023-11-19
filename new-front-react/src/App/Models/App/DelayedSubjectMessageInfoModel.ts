export default interface DelayedSubjectMessageInfoModel {
    subjectCode: number,
    subjectName: string,
    delayedRooms: DelayedRoomMessageInfoModel[]
}

export interface DelayedRoomMessageInfoModel {
    roomId: string,
    roomName: string,
    messageCount: number
}