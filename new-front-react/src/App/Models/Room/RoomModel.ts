export default interface RoomModel {
    id: string,
    name: string,
    image: string,
    isJoined: boolean,
    subject: SubjectForRoomModel
}

export interface SubjectForRoomModel {
    subjectId: number,
    subjectCode: number,
    subjectName: string,
    doctorId: string
}