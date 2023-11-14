using Domain.Identity;

namespace Domain.Room;

public class UserRoom
{
    public Guid Id { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }
    public Guid RoomId { get; set; }
    public Room Room { get; set; }
}