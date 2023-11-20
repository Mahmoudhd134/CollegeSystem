using Domain.Identity;

namespace Domain.Room;

public class Message
{
    public Guid Id { get; set; }
    public string Text { get; set; }
    public DateTime Date { get; set; }
    public string SenderId { get; set; }
    public User Sender { get; set; }
    public Guid RoomId { get; set; }
    public Room Room { get; set; }
    public bool IsRead { get; set; }
}