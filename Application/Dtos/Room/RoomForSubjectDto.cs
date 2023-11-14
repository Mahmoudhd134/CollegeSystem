namespace Application.Dtos.Room;

public class RoomForSubjectDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Image { get; set; }
    public int SubjectId { get; set; }
}