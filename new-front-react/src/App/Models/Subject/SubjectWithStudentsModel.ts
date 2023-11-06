export interface SubjectWithStudentsModel {
    id: number;
    department: string;
    code: number;
    hours: number;
    name: string;
    hasADoctor: boolean;
    doctorId: string;
    numberOfStudents: number;
    numberOfStudentsForEachDepartment: DepartmentAndCount[];
}

interface DepartmentAndCount {
    department: string;
    count: number;
}