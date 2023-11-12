using Application.Dtos.Subject;

namespace Application.Dtos.Student;

public class StudentDto
{
    public string Id { get; set; }
    public string Firstname { get; set; }
    public string Lastname { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string NationalNumber { get; set; }
    public string Department { get; set; }
    public bool IsOwner { get; set; }
    public string ProfilePhoto { get; set; }
    public IList<SubjectForStudentDto> Subjects { get; set; }
}