using Domain.Identity;

namespace Domain.Room;

public class UserMessageState
{
    public Guid Id { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }
    public Guid RoomId { get; set; }
    public Room Room { get; set; }
    public Guid MessageId { get; set; }
    public Message Message { get; set; }
    public bool IsDelivered { get; set; }
    public DateTime? DeliveredDate { get; set; }
    public bool IsRead { get; set; }
    public DateTime? ReadDate { get; set; }
}