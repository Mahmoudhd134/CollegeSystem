using Application.Dtos.Auth;

namespace Application.Dtos.Student;

public class AddStudentDto : RegisterUserDto
{
    public string Department { get; set; }
}