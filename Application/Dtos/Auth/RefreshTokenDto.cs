namespace Application.Dtos.Auth;

public class RefreshTokenDto : TokenDto
{
    public string RefreshToken { get; set; }
    public string UserId { get; set; }
}