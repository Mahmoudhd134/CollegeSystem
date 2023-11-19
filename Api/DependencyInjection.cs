using System.Text;
using Api.Hubs.Implementation;
using Application.Abstractions;
using Application.Dtos.RealTimeConnection;
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
        services.AddSingleton(_ => new Dictionary<string, UserRoomConnection>());
        services.AddSingleton(_ => new Dictionary<string, UserAppConnection>());
        services.AddSingleton<IAppRealTimeMethods, SignalRAppRealTimeMethods>();
        services.AddSingleton<IRoomRealTimeMethods, SignalRRoomRealTimeMethods>();


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
                opt.TokenValidationParameters =
                    Constants.GetValidationParameters(
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:key"]!)));
                opt.Events = new JwtBearerEvents()
                {
                    OnMessageReceived = context =>
                    {
                        var token = context.Request.Query["access_token"];
                        var isHubPath = context.Request.Path.StartsWithSegments("/hub");
                        if (!string.IsNullOrWhiteSpace(token) && isHubPath)
                            context.Token = token;
                        return Task.CompletedTask;
                    }
                };
            });

        services.AddDirectoryBrowser();

        services.AddSignalR();

        return services;
    }
}