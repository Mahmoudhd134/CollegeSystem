namespace Application.Dtos.Mail;

public class MailForReceivedListDto : MailForSendListDto
{
    public bool Read { get; set; }
}