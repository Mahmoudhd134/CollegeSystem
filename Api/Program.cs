using Api;
using Api.Hubs.App;
using Api.Hubs.Room;
using Application;
using Microsoft.Extensions.FileProviders;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetSection("connectionStrings")["default"];
builder.Services
    .AddApplicationConfiguration()
    .AddPersistenceConfigurations(connectionString)
    .AddApiConfiguration(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseFileServer(new FileServerOptions
{
    FileProvider = new PhysicalFileProvider(builder.Environment.WebRootPath),
    EnableDirectoryBrowsing = true
});

app.UseCors("allowLocalInDevelopment");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<RoomHub>("hub/room");
app.MapHub<AppHub>("hub/app");
app.MapFallbackToFile("index.html");

app.Run();