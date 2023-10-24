using Domain.Messages;
using Microsoft.AspNetCore.Identity;

namespace Domain.Identity;

public class User : IdentityUser<string>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Type { get; set; }
    public string ProfilePhoto { get; set; } = "default.png";
    public string NationalNumber { get; set; }
    public IList<Message> MessagesSend { get; set; } = new List<Message>();
    public IList<Message> MessagesReceived { get; set; } = new List<Message>();
}