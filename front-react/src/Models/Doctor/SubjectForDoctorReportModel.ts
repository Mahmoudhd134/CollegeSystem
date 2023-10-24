import SubjectFileTypes from "../Subject/SubjectFileTypes";

export interface SubjectForDoctorReportModel {
    id: number;
    department: string;
    code: number;
    name: string;
    completedTypes: SubjectFileTypes[];
    unCompletedTypes: SubjectFileTypes[];
}