namespace Domain.Identity;

public class UserRefreshToken
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }
    public string UserAgent { get; set; }
    public string RefreshToken { get; set; }
}