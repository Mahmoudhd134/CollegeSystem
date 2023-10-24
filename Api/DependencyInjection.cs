using System.Text;
using Application.Abstractions;
using Application.Helpers.Configurations;
using Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Api;

public static class DependencyInjection
{
    public static IServiceCollection AddApiConfiguration(this IServiceCollection services,
        ConfigurationManager configuration)
    {
        services.AddScoped<IFileAccessor, PhysicalFileAccessor>();


        services.AddAutoMapper(typeof(Program).Assembly);

        // add cors
        services.AddCors(opt => opt.AddPolicy("allowLocalInDevelopment", builder =>
        {
            builder
                .WithOrigins(
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .Build();
        }));

        //add helper classes configurations
        services.Configure<Jwt>(configuration.GetSection("Jwt"));
        services.Configure<Expiry>(configuration.GetSection("Expiry"));

        //add token configuration
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey =
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:key"]!)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

        services.AddDirectoryBrowser();

        return services;
    }
}