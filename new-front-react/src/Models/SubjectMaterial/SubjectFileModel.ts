import SubjectFileTypes from "../Subject/SubjectFileTypes";

export interface SubjectFileModel {
    id: number;
    name: string;
    storedName: string;
    subjectId: number;
    date: string;
    type: SubjectFileTypes
}