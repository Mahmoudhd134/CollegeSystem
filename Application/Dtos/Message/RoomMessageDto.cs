namespace Application.Dtos.Message;

public class RoomMessageDto
{
    public Guid Id { get; set; }
    public string Text { get; set; }
    public DateTime Date { get; set; }
    public SenderDto Sender { get; set; }
    public Guid RoomId { get; set; }
    public bool IsDelivered { get; set; }
    public bool IsRead { get; set; }
}