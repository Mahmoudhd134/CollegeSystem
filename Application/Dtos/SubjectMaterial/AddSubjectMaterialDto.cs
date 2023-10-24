using Domain.Subject;

namespace Application.Dtos.SubjectMaterial;

public class AddSubjectMaterialDto
{
    public int SubjectId { get; set; }
    public SubjectFileTypes Type { get; set; }
}