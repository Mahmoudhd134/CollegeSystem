using Application.Dtos.Message;

namespace Application.Abstractions;

public interface IAppRealTimeMethods
{
    Task SendMessageNotificationToUsers(IEnumerable<string> usersId,NewMessageNotificationDto newMessageNotificationDto);
}