namespace Application.Dtos.Message;

public class NewMessageNotificationDto
{
    public string First100Char { get; set; }
    public DateTime Date { get; set; }
    public Guid RoomId { get; set; }
    public string RoomName { get; set; }
    public int SubjectCode { get; set; }
    public string SubjectName { get; set; }
    public SenderDto Sender { get; set; }
}