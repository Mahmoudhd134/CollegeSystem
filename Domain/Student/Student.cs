using Domain.Identity;

namespace Domain.Student;

public class Student : User
{
    public string Department { get; set; }
    public IList<StudentSubjects> StudentSubjects { get; set; } = new List<StudentSubjects>();
}