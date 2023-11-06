import RegisterModel from "../Auth/RegisterModel";

export interface AddDoctorModel extends RegisterModel {
    nationalNumber: string;
}