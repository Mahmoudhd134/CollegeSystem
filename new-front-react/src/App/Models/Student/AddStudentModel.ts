import RegisterModel from "../Auth/RegisterModel";

export default interface AddStudentModel extends RegisterModel {
    department: string
}