using Application.Dtos.Mail;

namespace Application.MediatR.Queries.Mail;

public record GetReceivedMessagesQuery
    (string UserId, string UserName, int PageIndex, int PageSize) : IRequest<
        Response<IEnumerable<MailForReceivedListDto>>>;