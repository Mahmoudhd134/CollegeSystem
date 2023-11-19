using Application.Dtos.Message;

namespace Application.MediatR.Queries.Message;

public record GetMessagesAfterDateQuery
    (int MessagesCount, DateTime DateTime, string UserId,Guid RoomId) : IRequest<Response<IList<RoomMessageDto>>>;