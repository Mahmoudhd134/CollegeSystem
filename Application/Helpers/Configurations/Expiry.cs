namespace Application.Helpers.Configurations;

public class Expiry
{
    public int TokenExpiryInMinutes { get; set; }
    public int RefreshTokenExpiryInDays { get; set; }
}