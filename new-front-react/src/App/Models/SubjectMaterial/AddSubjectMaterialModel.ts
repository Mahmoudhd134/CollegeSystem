import SubjectFileTypes from "../Subject/SubjectFileTypes";

export interface AddSubjectMaterialDto {
    subjectId: number;
    type: SubjectFileTypes
}