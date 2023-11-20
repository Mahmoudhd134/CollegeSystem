using Application.Dtos.Message;

namespace Api.Hubs.Room;

public interface IRoomHubClient
{
    Task ReceiveMessage(RoomMessageDto roomMessageDto);
    Task MessageSendSuccessfully(Guid tempId, RoomMessageDto roomMessageDto);
    Task MessagesHaveBeenRead(IEnumerable<string> messagesId, Guid roomId);
}