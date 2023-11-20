namespace Application.Dtos.Message;

public class MessageStateDto
{
    public Guid Id { get; set; }
    public Guid RoomId { get; set; }
    public bool IsRead { get; set; }
}