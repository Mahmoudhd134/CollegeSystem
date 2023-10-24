namespace Application.Dtos.Message;

public class AddMessageDto
{
    // public string SenderId { get; set; }
    public string ReceiverId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
}