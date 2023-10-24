using Application.Dtos.Message;

namespace Application.MediatR.Queries.Messge;

public record GetSendMessagesQuery
    (string UserId, string UserName, int PageIndex, int PageSize) : IRequest<
        Response<IEnumerable<MessageForSendListDto>>>;