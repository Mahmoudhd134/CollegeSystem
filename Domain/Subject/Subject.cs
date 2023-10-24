using Domain.Doctor;
using Domain.Student;

namespace Domain.Subject;

public class Subject
{
    public int Id { get; set; }
    public string Department { get; set; }
    public int Code { get; set; }
    public string Name { get; set; }
    public int Hours { get; set; }
    public DoctorSubject DoctorSubject { get; set; }
    public IList<SubjectFiles> SubjectFiles { get; set; } = new List<SubjectFiles>();
    public IList<StudentSubjects> StudentSubjects { get; set; } = new List<StudentSubjects>();
}