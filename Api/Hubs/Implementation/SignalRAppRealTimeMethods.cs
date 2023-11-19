using Api.Hubs.App;
using Application.Abstractions;
using Application.Dtos.Message;
using Application.Dtos.RealTimeConnection;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs.Implementation;

public class SignalRAppRealTimeMethods : IAppRealTimeMethods
{
    private readonly IHubContext<AppHub, IAppHubClient> _appHub;
    private readonly Dictionary<string, UserAppConnection> _appConnections;

    public SignalRAppRealTimeMethods(IHubContext<AppHub, IAppHubClient> appHub,
        Dictionary<string, UserAppConnection> appConnections)
    {
        _appHub = appHub;
        _appConnections = appConnections;
    }

    public async Task SendMessageNotificationToUsers(IEnumerable<string> usersId,
        NewMessageNotificationDto newMessageNotificationDto)
    {
        var dict = _appConnections
            .ToDictionary(kvp => kvp.Value.UserId, kvp => kvp.Key);
        var connectionsId = usersId.Select(id => dict.GetValueOrDefault(id));
        await _appHub.Clients.Clients(connectionsId).ReceiveNewMessageNotification(newMessageNotificationDto);
    }
}