import {SubjectFileModel} from "../SubjectMaterial/SubjectFileModel";
import {DoctorForSubjectReportModel} from "./DoctorForSubjectReportModel";

export interface SubjectReportModel {
    id: number;
    department: string;
    code: number;
    hours: number;
    name: string;
    hasADoctor: boolean;
    doctor: DoctorForSubjectReportModel;
    files: SubjectFileModel[];
}

