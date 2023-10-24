import {SubjectForPageModel} from "../Subject/SubjectForPageModel";

export interface DoctorModel {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    phoneNumber: string;
    nationalNumber: string;
    isOwner: boolean;
    subjects: SubjectForPageModel[];
    isComplete: boolean,
    profilePhoto: string
}