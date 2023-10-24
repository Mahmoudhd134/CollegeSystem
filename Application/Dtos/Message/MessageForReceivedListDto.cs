namespace Application.Dtos.Message;

public class MessageForReceivedListDto : MessageForSendListDto
{
    public bool Read { get; set; }
}