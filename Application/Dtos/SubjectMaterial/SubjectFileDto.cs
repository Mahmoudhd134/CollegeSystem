using Domain.Subject;

namespace Application.Dtos.SubjectMaterial;

public class SubjectFileDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string StoredName { get; set; }
    public int SubjectId { get; set; }
    public DateTime Date { get; set; }
    public SubjectFileTypes Type { get; set; }
}