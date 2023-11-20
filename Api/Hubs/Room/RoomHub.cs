using Api.Hubs.App;
using Application.Dtos.Message;
using Application.Dtos.RealTimeConnection;
using Application.MediatR.Commands.Message;
using Application.MediatR.Commands.Room;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Primitives;

namespace Api.Hubs.Room;

public class RoomHub : BaseHub<IRoomHubClient>
{
    private readonly Dictionary<string, UserRoomConnection> _roomConnections;
    private readonly Dictionary<string, UserAppConnection> _appConnections;
    private readonly IHubContext<AppHub, IAppHubClient> _appHubContext;

    public RoomHub(Dictionary<string, UserRoomConnection> roomConnections,
        Dictionary<string, UserAppConnection> appConnections,
        IHubContext<AppHub, IAppHubClient> appHubContext)
    {
        _roomConnections = roomConnections;
        _appConnections = appConnections;
        _appHubContext = appHubContext;
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var roomId = new StringValues();
        var foundRoomId = httpContext?.Request.Query.TryGetValue("roomId", out roomId);
        if (!(foundRoomId ?? false))
            return;
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        _roomConnections.Add(Context.ConnectionId, new UserRoomConnection()
        {
            UserId = UserId,
            RoomId = Guid.Parse(roomId)
        });
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var roomId = _roomConnections
            .FirstOrDefault(x => x.Value.UserId == UserId)
            .Value.RoomId;
        _roomConnections.Remove(Context.ConnectionId);

        await Mediator.Send(new OutFromRoomCommand(roomId, UserId));

        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(AddMessageDto addMessageDto)
    {
        var response = await Mediator.Send(new AddMessageCommand(addMessageDto, UserId));
        if (response.IsSuccess == false)
            return;

        await Clients.Caller.MessageSendSuccessfully(addMessageDto.TempId, response.Data);
        await Clients.OthersInGroup(addMessageDto.RoomId.ToString()).ReceiveMessage(response.Data);
    }

    public async Task DeleteMessage(Guid roomId, Guid messageId)
    {
        var response = await Mediator.Send(new DeleteMessageCommand(messageId, UserId));
        if (response.IsSuccess == false)
            return;
        var connections = _appConnections.Where(kvp =>
                kvp.Value.UserRooms.Any(x => x.RoomId == roomId))
            .Select(kvp => kvp.Key);
        await _appHubContext.Clients.Clients(connections).DeleteMessage(roomId, messageId);
    }
}