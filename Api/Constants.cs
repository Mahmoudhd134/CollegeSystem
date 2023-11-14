using Microsoft.IdentityModel.Tokens;

namespace Api;

public static class Constants
{
    public static TokenValidationParameters GetValidationParameters(SecurityKey securityKey)
    {
        return new TokenValidationParameters()
        {
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidateAudience = false,
            ValidateIssuer = false,
            IssuerSigningKey = securityKey,
            ClockSkew = TimeSpan.Zero,
        };
    }
}