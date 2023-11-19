using Application.Dtos.Message;
using Application.Dtos.RealTimeConnection;
using Application.MediatR.Commands.Message;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Primitives;

namespace Api.Hubs.Room;

public class RoomHub : BaseHub<IRoomHubClient>
{
    private readonly Dictionary<string, UserRoomConnection> _connections;

    public RoomHub(Dictionary<string, UserRoomConnection> connections)
    {
        _connections = connections;
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var roomId = new StringValues();
        var foundRoomId = httpContext?.Request.Query.TryGetValue("roomId", out roomId);
        if (!(foundRoomId ?? false))
            return;
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        _connections.Add(Context.ConnectionId, new UserRoomConnection()
        {
            UserId = UserId,
            RoomId = Guid.Parse(roomId)
        });
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        _connections.Remove(Context.ConnectionId);
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
}