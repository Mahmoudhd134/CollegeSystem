using Application.Dtos.SubjectMaterial;

namespace Application.Dtos.Subject;

public class SubjectReportDto
{
    public int Id { get; set; }
    public string Department { get; set; }
    public int Code { get; set; }
    public int Hours { get; set; }
    public string Name { get; set; }
    public bool HasADoctor { get; set; }
    public bool IsComplete { get; set; }
    public DoctorForSubjectReportDto Doctor { get; set; }
    public IList<SubjectFileDto> Files { get; set; }
}