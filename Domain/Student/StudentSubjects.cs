namespace Domain.Student;

public class StudentSubjects
{
    public Guid Id { get; set; }
    public string StudentId { get; set; }
    public Student Student { get; set; }
    public int SubjectId { get; set; }
    public Subject.Subject Subject { get; set; }
}