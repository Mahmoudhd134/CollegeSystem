namespace Application.Dtos.Message;

public class AddMessageDto
{
    public Guid TempId { get; set; }
    public string Text { get; set; }
    public Guid RoomId { get; set; }

    public SenderDto Sender { get; set; }
}