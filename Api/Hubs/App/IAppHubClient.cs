﻿using Application.Dtos.Message;

namespace Api.Hubs.App;

public interface IAppHubClient
{
    Task ReceiveNewMessageNotification(NewMessageNotificationDto newMessageNotificationDto);
    Task DeleteMessage(Guid roomId, Guid messageId);
}