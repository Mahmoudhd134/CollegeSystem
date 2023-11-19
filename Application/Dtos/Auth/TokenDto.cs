namespace Application.Dtos.Auth;

public class TokenDto
{
    public IEnumerable<string> Roles { get; set; }
    public string Token { get; set; }
    public string ProfileImage { get; set; }
}