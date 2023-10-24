namespace Application.Dtos.Doctor;

public class DoctorReportDto
{
    public string Id { get; set; }
    public string Firstname { get; set; }
    public string Lastname { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string NationalNumber { get; set; }
    public IList<SubjectForDoctorReportDto> Subjects { get; set; }
    public bool IsComplete { get; set; }
}