namespace Application.Dtos.Room;

public class RoomDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Image { get; set; }
    public bool IsJoined { get; set; }
    public SubjectForRoomDto Subject { get; set; }
}

public class SubjectForRoomDto
{
    public int SubjectId { get; set; }
    public int SubjectCode { get; set; }
    public string SubjectName { get; set; }
    public string DoctorId { get; set; }
}