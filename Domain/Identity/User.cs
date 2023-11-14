using Domain.Mails;
using Domain.Room;
using Microsoft.AspNetCore.Identity;

namespace Domain.Identity;

public class User : IdentityUser<string>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Type { get; set; }
    public string ProfilePhoto { get; set; } = "default.png";
    public string NationalNumber { get; set; }
    public IList<Mail> MailsSend { get; set; } = new List<Mail>();
    public IList<Mail> MailsReceived { get; set; } = new List<Mail>();

    public IList<UserRoom> UserRooms { get; set; } = new List<UserRoom>();
}