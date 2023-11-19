namespace Application.Dtos.Room;

public class RoomDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Image { get; set; }
    public bool IsJoined { get; set; }
    public int SubjectId { get; set; }
}