using Domain.Subject;

namespace Application.Dtos.Doctor;

public class SubjectForDoctorReportDto
{
    public int Id { get; set; }
    public string Department { get; set; }
    public int Code { get; set; }
    public string Name { get; set; }
    public IList<SubjectFileTypes> CompletedTypes { get; set; }
    public IList<SubjectFileTypes> UnCompletedTypes { get; set; }
}