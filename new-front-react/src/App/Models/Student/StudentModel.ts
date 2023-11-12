import SubjectForStudentModel from "./SubjectForStudentModel";

export default interface StudentModel {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    phoneNumber: string;
    nationalNumber: string;
    isOwner: boolean;
    profilePhoto: string;
    department: string,
    subjects: SubjectForStudentModel[];
}
