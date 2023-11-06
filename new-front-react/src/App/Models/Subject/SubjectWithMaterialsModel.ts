import {SubjectFileModel} from "../SubjectMaterial/SubjectFileModel";

export interface SubjectWithMaterialsModel {
    id: number;
    department: string;
    code: number;
    hours: number;
    name: string;
    isOwner: boolean;
    hasADoctor: boolean;
    doctorId: string;
    files: SubjectFileModel[];
    numberOfFileTypesUploaded: number;
    totalNumberOfFilesRequired: number;
}