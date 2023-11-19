using Api.Hubs.Room;
using Application.Abstractions;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs.Implementation;

public class SignalRRoomRealTimeMethods : IRoomRealTimeMethods
{
    private readonly IHubContext<RoomHub, IRoomHubClient> _roomHub;

    public SignalRRoomRealTimeMethods(IHubContext<RoomHub, IRoomHubClient> roomHub)
    {
        _roomHub = roomHub;
    }

    public async Task MakeIsReadToTrueForMessagesInRoom(IEnumerable<Guid> messagesId, Guid roomId)
    {
        await _roomHub.Clients.Group(roomId.ToString())
            .MessagesHaveBeenRead(messagesId.Select(x => x.ToString()), roomId);
    }

    public async Task MakeIsDeliveredToTrueForMessagesInRoom(IEnumerable<Guid> messagesId, Guid roomId)
    {
        await _roomHub.Clients.Group(roomId.ToString())
            .MessagesHaveBeenDelivered(messagesId.Select(x => x.ToString()), roomId);
    }
}