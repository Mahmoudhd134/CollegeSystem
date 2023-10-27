namespace Application.Dtos.Subject;

public class SubjectWithStudentsDto
{
    public int Id { get; set; }
    public string Department { get; set; }
    public int Code { get; set; }
    public int Hours { get; set; }
    public string Name { get; set; }
    public bool HasADoctor { get; set; }
    public string DoctorId { get; set; }
    public int NumberOfStudents { get; set; }
    public List<x> NumberOfStudentsForEachDepartment { get; set; }
}

public class x
{
    public string Department { get; set; }
    public int Count { get; set; }
}