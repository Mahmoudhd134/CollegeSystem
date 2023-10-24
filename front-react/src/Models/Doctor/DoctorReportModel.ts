import {SubjectForDoctorReportModel} from "./SubjectForDoctorReportModel";

export interface DoctorReportModel {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    phoneNumber: string;
    nationalNumber: string;
    subjects: SubjectForDoctorReportModel[];
    isComplete: boolean;
}