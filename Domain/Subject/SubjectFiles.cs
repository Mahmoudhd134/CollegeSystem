namespace Domain.Subject;

public class SubjectFiles
{
    public int Id { get; set; }
    public string StoredName { get; set; }
    public string FileName { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public int SubjectId { get; set; }
    public Subject Subject { get; set; }
    public SubjectFileTypes Type { get; set; }
}