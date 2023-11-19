using Application.Dtos.RealTimeConnection;
using Application.MediatR.Queries.Room;

namespace Api.Hubs.App;

public class AppHub : BaseHub<IAppHubClient>
{
    private readonly Dictionary<string, UserAppConnection> _connections;

    public AppHub(Dictionary<string, UserAppConnection> connections)
    {
        _connections = connections;
    }

    public override async Task OnConnectedAsync()
    {
        _connections.Add(Context.ConnectionId, new UserAppConnection()
        {
            UserId = UserId,
            UserRooms = (await Mediator.Send(new GetUserJoinedRoomsQuery(UserId))).Data
        });
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        _connections.Remove(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}