namespace Application.Abstractions;

public interface IRoomRealTimeMethods
{
    Task MakeIsReadToTrueForMessagesInRoom(IEnumerable<Guid> messagesId, Guid roomId);
}