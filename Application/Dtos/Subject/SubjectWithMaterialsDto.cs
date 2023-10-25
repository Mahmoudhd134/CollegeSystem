using Application.Dtos.SubjectMaterial;
using Domain.Subject;

namespace Application.Dtos.Subject;

public class SubjectWithMaterialsDto
{
    public int Id { get; set; }
    public string Department { get; set; }
    public int Code { get; set; }
    public int Hours { get; set; }
    public string Name { get; set; }
    public bool IsOwner { get; set; }
    public bool HasADoctor { get; set; }
    public string DoctorId { get; set; }
    public IList<SubjectFileDto> Files { get; set; }
    public int NumberOfFileTypesUploaded { get; set; }
    public int TotalNumberOfFilesRequired { get; set; } = Enum.GetValues(typeof(SubjectFileTypes)).Length;
}