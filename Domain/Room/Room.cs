namespace Domain.Room;

public class Room
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Image { get; set; } = "default.png";
    public int SubjectId { get; set; }
    public Subject.Subject Subject { get; set; }
    public IList<Message> Messages { get; set; } = new List<Message>();
    public IList<UserRoom> UserRooms { get; set; } = new List<UserRoom>();
}